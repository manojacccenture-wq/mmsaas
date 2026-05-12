import React, { useState } from "react";
import Button from "@/shared/components/UI/Button/Button";
import Table from "@/shared/components/UI/Table/Table";
import type { Column } from "@/shared/components/UI/Table/Table";
import Pagination from "@/shared/components/UI/Table/Pagination";
import { 
  useGetDemoRequestsQuery, 
  useApproveDemoRequestMutation, 
  useRejectDemoRequestMutation 
} from "../api/demoRequestApi";
import { mapDemoRequestToUI } from "../api/demoRequest.transform";
import {type DemoRequestUI, type DemoRequestApiResponse } from "../api/demoRequest.types";

const DemoRequest: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const { data: responseData, isLoading, isFetching, error } = useGetDemoRequestsQuery({
    page: currentPage,
    limit: itemsPerPage
  });

  const [approveRequest, { isLoading: isApproving }] = useApproveDemoRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectDemoRequestMutation();

  // Handling standard JSend format { status: "success", data: { requests, pagination } }
  const apiRequests: DemoRequestApiResponse[] = responseData?.data?.requests || responseData?.requests || [];
  const pagination = responseData?.data?.pagination || responseData?.pagination || { total: 0, pages: 1, page: 1 };
  
  const requests: DemoRequestUI[] = apiRequests.map(mapDemoRequestToUI);

  const handleApprove = async (id: string) => {
    try {
      await approveRequest(id).unwrap();
    } catch (err: any) {
      console.error("Failed to approve request:", err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectRequest(id).unwrap();
    } catch (err: any) {
      console.error("Failed to reject request:", err);
    }
  };

  const columns: Column<DemoRequestUI>[] = [
    {
      key: "firstName",
      label: "Name",
      render: (_, row) => `${row.firstName} ${row.lastName}`
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
    if (row.status !== "pending") return null;

    return (
      <div className="flex gap-2">
        <Button
          variant="outlineDanger"
          size="sm"
          disabled={isRejecting || isApproving}
          onClick={(e) => { e.stopPropagation(); handleReject(row.id); }}
        >
          Reject
        </Button>
        <Button
          variant="primary"
          size="sm"
          disabled={isApproving || isRejecting}
          onClick={(e) => { e.stopPropagation(); handleApprove(row.id); }}
        >
          Approve
        </Button>
      </div>
    );
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
    </div>
  );
};

export default DemoRequest;
