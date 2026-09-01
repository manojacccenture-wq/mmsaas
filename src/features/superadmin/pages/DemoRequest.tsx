import React, { useState } from "react";
import Button from "@/shared/components/UI/Button/Button";
import { useAppDispatch } from "@/app/store/hook";
import { showToast } from "@/shared/components/Toast/api/toastSlice";
import Table from "@/shared/components/UI/Table/Table";
import type { Column } from "@/shared/components/UI/Table/Table";
import Pagination from "@/shared/components/UI/Table/Pagination";
import Modal from "@/shared/components/Modal/Modal";
import { 
  useGetDemoRequestsQuery, 
  useApproveDemoRequestMutation, 
  useRejectDemoRequestMutation,
  useDeleteDemoRequestMutation
} from "../api/demoRequestApi";
import { mapDemoRequestToUI } from "../api/demoRequest.transform";
import {type DemoRequestUI, type DemoRequestApiResponse } from "../api/demoRequest.types";

const DemoRequest: React.FC = () => {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: "approve" | "reject" | null; request: DemoRequestUI | null }>({
    isOpen: false,
    type: null,
    request: null,
  });

  // View details modal state
  const [detailsModal, setDetailsModal] = useState<{ isOpen: boolean; request: DemoRequestUI | null }>({
    isOpen: false,
    request: null,
  });

  // Credentials display state
  const [credentialsModal, setCredentialsModal] = useState<{ isOpen: boolean; email: string; password: string; companyName: string }>({
    isOpen: false,
    email: "",
    password: "",
    companyName: "",
  });

  const { data: responseData, isLoading, isFetching, error } = useGetDemoRequestsQuery({
    page: currentPage,
    limit: itemsPerPage
  });

  const [approveRequest, { isLoading: isApproving }] = useApproveDemoRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectDemoRequestMutation();
  const [deleteRequest, { isLoading: isDeleting }] = useDeleteDemoRequestMutation();

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; request: DemoRequestUI | null; confirmName: string }>({
    isOpen: false,
    request: null,
    confirmName: "",
  });

  // Handling standard JSend format { status: "success", data: { requests, pagination } }
  const apiRequests: DemoRequestApiResponse[] = responseData?.data?.requests || responseData?.requests || [];
  const pagination = responseData?.data?.pagination || responseData?.pagination || { total: 0, pages: 1, page: 1 };
  
  const requests: DemoRequestUI[] = apiRequests.map(mapDemoRequestToUI);

  const handleApprove = async (id: string) => {
    try {
      const result = await approveRequest(id).unwrap();
      dispatch(showToast({ message: "Demo request approved and tenant created successfully", type: "success" }));
      setConfirmModal({ isOpen: false, type: null, request: null });
      
      // Show credentials modal after successful approval
      const requestData = requests.find(r => r.id === id);
      if (requestData) {
        // The password is generated server-side; we show a placeholder
        // In production, the backend would return the credentials
        setCredentialsModal({
          isOpen: true,
          email: requestData.workEmail,
          password: "Check activation email for password",
          companyName: requestData.companyName,
        });
      }
    } catch (err: any) {
      console.error("Failed to approve request:", err);
      setConfirmModal({ isOpen: false, type: null, request: null });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectRequest(id).unwrap();
      dispatch(showToast({ message: "Demo request rejected", type: "success" }));
      setConfirmModal({ isOpen: false, type: null, request: null });
    } catch (err: any) {
      console.error("Failed to reject request:", err);
      setConfirmModal({ isOpen: false, type: null, request: null });
    }
  };

  const openApproveConfirm = (request: DemoRequestUI) => {
    setConfirmModal({ isOpen: true, type: "approve", request });
  };

  const openRejectConfirm = (request: DemoRequestUI) => {
    setConfirmModal({ isOpen: true, type: "reject", request });
  };

  const openDeleteConfirm = (request: DemoRequestUI) => {
    setDeleteModal({ isOpen: true, request, confirmName: "" });
  };

  const handleDelete = async () => {
    if (!deleteModal.request || deleteModal.confirmName.trim() !== deleteModal.request.companyName) return;
    try {
      await deleteRequest(deleteModal.request.id).unwrap();
      dispatch(showToast({ message: "Demo request and tenant deleted successfully", type: "success" }));
      setDeleteModal({ isOpen: false, request: null, confirmName: "" });
    } catch (err: any) {
      console.error("Failed to delete demo request:", err);
      const errorMessage = err?.data?.message || err?.message || "Failed to delete demo request.";
      dispatch(showToast({ message: errorMessage, type: "error" }));
    }
  };

  const columns: Column<DemoRequestUI>[] = [
    {
      key: "fullName",
      label: "Name",
      render: (_, row) => row.fullName
    },
    {
      key: "companyName",
      label: "Company",
    },
    {
      key: "workEmail",
      label: "Email",
    },
    {
      key: "createdAt",
      label: "Date",
      render: (val) => new Date(val as string).toLocaleDateString()
    },
    {
      key: "status",
      label: "Status",
      render: (val) => {
        const status = val as string;
        const colorClass =
          status === "pending"
            ? "bg-yellow-100 text-yellow-800"
            : status === "activated"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800";
        
        return (
          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      }
    }
  ];

  const renderActions = (row: DemoRequestUI) => {
    if (row.status === "pending") {
      return (
        <div className="flex gap-2">
          <Button
            variant="outlineSecondary"
            size="sm"
            onClick={(e) => { e.stopPropagation(); setDetailsModal({ isOpen: true, request: row }); }}
          >
            View
          </Button>
          <Button
            variant="outlineDanger"
            size="sm"
            disabled={isRejecting || isApproving}
            onClick={(e) => { e.stopPropagation(); openRejectConfirm(row); }}
          >
            Reject
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={isApproving || isRejecting}
            onClick={(e) => { e.stopPropagation(); openApproveConfirm(row); }}
          >
            Approve
          </Button>
        </div>
      );
    }

    if (row.status === "activated") {
      return (
        <div className="flex gap-2">
          <Button
            variant="outlineSecondary"
            size="sm"
            onClick={(e) => { e.stopPropagation(); setDetailsModal({ isOpen: true, request: row }); }}
          >
            View
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={isDeleting}
            onClick={(e) => { e.stopPropagation(); openDeleteConfirm(row); }}
          >
            Delete
          </Button>
        </div>
      );
    }

    return null;
  };

  const isTableLoading = isLoading || isFetching;
  const errorMessage = error ? (error as any)?.data?.message || "Failed to load demo requests." : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[var(--color-text-title)]">Demo Requests</h1>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-neutral-20)] overflow-hidden">
        <Table
          columns={columns}
          data={requests}
          loading={isTableLoading}
          actions={renderActions}
          emptyMessage="No demo requests found."
        />

        {!isTableLoading && pagination.pages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.pages}
            totalCount={pagination.total}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null, request: null })}
        header={<h2>{confirmModal.type === "approve" ? "Approve Demo Request" : "Reject Demo Request"}</h2>}
        width="440px"
      >
        <div className="flex flex-col gap-4">
          {confirmModal.type === "approve" ? (
            <>
              <p className="text-gray-600">
                Approving this request will create a new tenant with a 14-day trial subscription. 
                An activation email will be sent to the client with login credentials.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm"><span className="font-medium">Company:</span> {confirmModal.request?.companyName}</p>
                <p className="text-sm"><span className="font-medium">Email:</span> {confirmModal.request?.workEmail}</p>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600">
                Are you sure you want to reject this demo request? This action cannot be undone.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm"><span className="font-medium">Company:</span> {confirmModal.request?.companyName}</p>
                <p className="text-sm"><span className="font-medium">Email:</span> {confirmModal.request?.workEmail}</p>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="outlineSecondary"
              onClick={() => setConfirmModal({ isOpen: false, type: null, request: null })}
              disabled={isApproving || isRejecting}
            >
              Cancel
            </Button>
            <Button
              variant={confirmModal.type === "approve" ? "primary" : "danger"}
              onClick={() => {
                if (confirmModal.request) {
                  if (confirmModal.type === "approve") {
                    handleApprove(confirmModal.request.id);
                  } else {
                    handleReject(confirmModal.request.id);
                  }
                }
              }}
              disabled={isApproving || isRejecting}
            >
              {isApproving || isRejecting
                ? "Processing..."
                : confirmModal.type === "approve"
                ? "Approve & Create Tenant"
                : "Reject Request"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, request: null })}
        header={<h2>Demo Request Details</h2>}
        width="480px"
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Name</p>
              <p className="text-sm text-gray-900">{detailsModal.request?.fullName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Company</p>
              <p className="text-sm text-gray-900">{detailsModal.request?.companyName}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
              <p className="text-sm text-gray-900">{detailsModal.request?.workEmail}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Phone</p>
              <p className="text-sm text-gray-900">{detailsModal.request?.phoneNumber || "Not provided"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                detailsModal.request?.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : detailsModal.request?.status === "activated"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {detailsModal.request?.status?.charAt(0).toUpperCase()}{detailsModal.request?.status?.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Submitted</p>
              <p className="text-sm text-gray-900">{detailsModal.request?.createdAt ? new Date(detailsModal.request.createdAt).toLocaleDateString() : "—"}</p>
            </div>
          </div>
          {detailsModal.request?.useCase && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Use Case & Details</p>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{detailsModal.request.useCase}</p>
            </div>
          )}
          <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="primary"
              onClick={() => setDetailsModal({ isOpen: false, request: null })}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Credentials Display Modal */}
      <Modal
        isOpen={credentialsModal.isOpen}
        onClose={() => setCredentialsModal({ isOpen: false, email: "", password: "", companyName: "" })}
        header={<h2>Tenant Created Successfully</h2>}
        width="480px"
      >
        <div className="flex flex-col gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium text-green-800">Demo tenant created for {credentialsModal.companyName}</span>
            </div>
            <p className="text-sm text-green-700">
              An activation email has been sent to the client with login credentials and instructions.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm"><span className="font-medium text-gray-700">Login Email:</span> <span className="text-gray-900">{credentialsModal.email}</span></p>
            <p className="text-sm"><span className="font-medium text-gray-700">Password:</span> <span className="text-gray-900">{credentialsModal.password}</span></p>
            <p className="text-sm text-gray-500 mt-2">The temporary password was sent to the client's email address.</p>
          </div>

          <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="primary"
              onClick={() => setCredentialsModal({ isOpen: false, email: "", password: "", companyName: "" })}
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, request: null, confirmName: "" })}
        header={<h2>Delete Demo Request</h2>}
        width="480px"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Permanently delete this demo request and its tenant?</p>
              <p className="text-sm text-gray-500 mt-1">
                This will remove the tenant, all users, subscriptions, product assignments, and all associated data. This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm"><span className="font-medium">Company:</span> {deleteModal.request?.companyName}</p>
            <p className="text-sm"><span className="font-medium">Email:</span> {deleteModal.request?.workEmail}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="font-bold text-gray-900">{deleteModal.request?.companyName}</span> to confirm
            </label>
            <input
              type="text"
              value={deleteModal.confirmName}
              onChange={(e) => setDeleteModal({ ...deleteModal, confirmName: e.target.value })}
              placeholder={deleteModal.request?.companyName}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              disabled={isDeleting}
            />
          </div>

          <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-gray-100">
            <Button
              variant="outlineSecondary"
              onClick={() => setDeleteModal({ isOpen: false, request: null, confirmName: "" })}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isDeleting || deleteModal.confirmName.trim() !== deleteModal.request?.companyName}
            >
              {isDeleting ? "Deleting..." : "Delete Tenant & Request"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DemoRequest;
