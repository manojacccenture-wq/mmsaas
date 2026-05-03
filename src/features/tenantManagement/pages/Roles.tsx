import { useState } from "react";
import {
  useGetGlobalRolesQuery,
  useCreateGlobalRoleMutation,
  useGetIAMPoliciesQuery,
  useAttachPolicyToRoleMutation
} from "../api/tenantApi";
import Button from "@/shared/components/UI/Button/Button";
import Card from "@/shared/components/UI/Card/Card";
import Input from "@/shared/components/UI/Input/Input";
import Select from "@/shared/components/UI/Select/Select";
import Table, { type Column } from "@/shared/components/UI/Table/Table";

const Roles = () => {
  // Queries
  const { data: rolesData, isLoading: rolesLoading } = useGetGlobalRolesQuery({});
  const { data: policiesData } = useGetIAMPoliciesQuery({});
  
  // Mutations
  const [createRole] = useCreateGlobalRoleMutation();
  const [attachPolicy] = useAttachPolicyToRoleMutation();

  // Local state
  const [newRole, setNewRole] = useState({ name: "", code: "" });
  const [assignment, setAssignment] = useState({ roleId: "", policyId: "" });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRole(newRole).unwrap();
      setNewRole({ name: "", code: "" });
      alert("Role created successfully!");
    } catch (err) {
      alert("Failed to create role");
    }
  };

  const handleAttach = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await attachPolicy(assignment).unwrap();
      setAssignment({ roleId: "", policyId: "" });
      alert("Policy attached to role!");
    } catch (err) {
      alert("Failed to attach policy");
    }
  };

  const columns: Column<any>[] = [
    { key: "name", label: "Role Name" },
    { 
      key: "code", 
      label: "System Code",
      render: (val) => <code className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">{val}</code>
    },
    {
      key: "isSystem",
      label: "Type",
      render: (val) => val ? (
        <span className="text-blue-600 text-xs font-bold uppercase tracking-tight">System</span>
      ) : (
        <span className="text-amber-600 text-xs font-bold uppercase tracking-tight">Custom</span>
      )
    }
  ];

  const roles = rolesData?.data || [];
  const policies = policiesData?.data || [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Business Roles</h1>
        <p className="text-gray-500 font-medium">Define custom roles like Junior Waiter and attach IAM security policies.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CREATE ROLE */}
        <Card className="p-6 border-l-4 border-indigo-600 shadow-xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
              +
            </div>
            Create New Role
          </h2>
          <form onSubmit={handleCreate} className="space-y-5">
            <Input
              label="Display Name"
              placeholder="e.g. Senior Waiter"
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              required
            />
            <Input
              label="System Code"
              placeholder="e.g. SENIOR_WAITER"
              value={newRole.code}
              onChange={(e) => setNewRole({ ...newRole, code: e.target.value.toUpperCase() })}
              required
            />
            <Button type="submit" variant="primary" className="w-full font-bold uppercase py-3 shadow-lg shadow-indigo-100">
              Register Role
            </Button>
          </form>
        </Card>

        {/* ATTACH POLICY */}
        <Card className="p-6 border-l-4 border-emerald-500 shadow-xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
              🔒
            </div>
            Policy Assignment
          </h2>
          <form onSubmit={handleAttach} className="space-y-5">
            <Select
              label="Role Target"
              options={roles.map((r: any) => ({ value: r._id, label: `${r.name} (${r.code})` }))}
              value={assignment.roleId}
              onChange={(e) => setAssignment({ ...assignment, roleId: e.target.value })}
              required
              placeholder="Select role to modify"
            />
            <Select
              label="IAM Policy"
              options={policies.map((p: any) => ({ value: p._id, label: p.name }))}
              value={assignment.policyId}
              onChange={(e) => setAssignment({ ...assignment, policyId: e.target.value })}
              required
              placeholder="Select security policy"
            />
            <Button type="submit" variant="secondary" className="w-full font-bold uppercase py-3 shadow-lg shadow-emerald-100">
              Attach Security Layer
            </Button>
          </form>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden shadow-2xl border-none">
        <div className="p-6 bg-gray-50 border-b">
          <h2 className="text-xl font-bold text-gray-800">Role Inventory</h2>
        </div>
        <Table
          columns={columns}
          data={roles}
          loading={rolesLoading}
          emptyMessage="No roles defined in system"
        />
      </Card>
    </div>
  );
};

export default Roles;
