import React, { useState } from "react";
import Button from "@/shared/components/UI/Button/Button";
import Table from "@/shared/components/UI/Table/Table";
import type { Column } from "@/shared/components/UI/Table/Table";
import Pagination from "@/shared/components/UI/Table/Pagination";
import { useGetPlansQuery } from "../api/planApi";
import { mapPlanToUI } from "../api/plan.transform";
import { type PlanUI, type PlanApiResponse } from "../api/plan.types";
import { useNavigate } from "react-router-dom";

const Plans: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const { data: responseData, isLoading, isFetching, error } = useGetPlansQuery({
    page: currentPage,
    limit: itemsPerPage,
    includeInactive: true
  });

  const apiPlans: PlanApiResponse[] = responseData?.data?.data || [];
  const pagination = responseData?.data?.pagination || { total: 0, pages: 1, page: 1 };

  const plans: PlanUI[] = apiPlans.map(mapPlanToUI);

  const columns: Column<PlanUI>[] = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "code",
      label: "Code",
    },
    {
      key: "price",
      label: "Price",
      render: (val) => `₹${val}`
    },
    {
      key: "billingCycle",
      label: "Cycle",
      render: (val) => (val as string).charAt(0).toUpperCase() + (val as string).slice(1)
    },
    {
      key: "isActive",
      label: "Status",
      render: (val) => {
        const isActive = val as boolean;
        const colorClass = isActive
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800";

        return (
          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      }
    }
  ];

  const renderActions = (row: PlanUI) => {
    return (
      <div className="flex gap-2">
        <Button
          variant="outlinePrimary"
          size="sm"
          onClick={(e) => { e.stopPropagation(); navigate(`/superadmin/plans/${row.id}`); }}
        >
          Edit
        </Button>
      </div>
    );
  };

  const isTableLoading = isLoading || isFetching;
  const errorMessage = error ? (error as any)?.data?.message || "Failed to load plans." : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[var(--color-text-title)]">Subscription Plans</h1>
        <Button variant="primary" onClick={() => navigate("/superadmin/plans/create")}>
          Create Plan
        </Button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm">
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-neutral-20)] overflow-hidden">
        <Table
          columns={columns}
          data={plans}
          loading={isTableLoading}
          actions={renderActions}
          emptyMessage="No subscription plans found."
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

export default Plans;
