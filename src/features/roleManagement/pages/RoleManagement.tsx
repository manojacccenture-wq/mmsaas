import { useState, useEffect } from "react";
import { roleApi, iamApi } from "../api/roleApi";
import Button from "@/shared/components/UI/Button/Button";
import Card from "@/shared/components/UI/Card/Card";
import Input from "@/shared/components/UI/Input/Input";
import Select from "@/shared/components/UI/Select/Select";

const RoleManagement = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newRole, setNewRole] = useState({ name: "", code: "" });
  const [assign, setAssign] = useState({ roleId: "", policyId: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roleRes, policyRes] = await Promise.all([
        roleApi.getRoles(),
        iamApi.getPolicies(),
      ]);
      setRoles(roleRes.data.data);
      setPolicies(policyRes.data.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await roleApi.createRole(newRole);
      setNewRole({ name: "", code: "" });
      fetchData();
      alert("Role created!");
    } catch (err) {
      alert("Failed to create role");
    }
  };

  const handleAttachPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await iamApi.attachPolicy(assign.roleId, assign.policyId);
      setAssign({ roleId: "", policyId: "" });
      alert("Policy attached!");
    } catch (err) {
      alert("Failed to attach policy");
    }
  };

  if (loading) return <div className="p-8 text-center font-bold">Loading Security Modules...</div>;

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Identity & Role Management</h1>
        <p className="text-gray-500 font-medium">Create custom business roles and attach granular IAM policies.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Role Card */}
        <Card className="p-6 border-t-4 border-indigo-600">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">➕</span>
            New Custom Role
          </h2>
          <form onSubmit={handleCreateRole} className="space-y-4">
            <Input
              label="Role Name"
              placeholder="e.g. Junior Waiter"
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              required
            />
            <Input
              label="Role Code"
              placeholder="e.g. JUNIOR_WAITER"
              value={newRole.code}
              onChange={(e) => setNewRole({ ...newRole, code: e.target.value.toUpperCase() })}
              required
            />
            <Button type="submit" variant="primary" className="w-full py-3 font-bold uppercase tracking-wide">
              Create Role
            </Button>
          </form>
        </Card>

        {/* Attach Policy Card */}
        <Card className="p-6 border-t-4 border-emerald-500">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">🔗</span>
            Assign Security Policy
          </h2>
          <form onSubmit={handleAttachPolicy} className="space-y-4">
            <Select
              label="Select Role"
              options={roles.map(r => ({ value: r._id, label: `${r.name} (${r.code})` }))}
              value={assign.roleId}
              onChange={(e) => setAssign({ ...assign, roleId: e.target.value })}
              required
            />
            <Select
              label="Select IAM Policy"
              options={policies.map(p => ({ value: p._id, label: p.name }))}
              value={assign.policyId}
              onChange={(e) => setAssign({ ...assign, policyId: e.target.value })}
              required
            />
            <Button type="submit" variant="secondary" className="w-full py-3 font-bold uppercase tracking-wide">
              Attach Policy
            </Button>
          </form>
        </Card>
      </div>

      {/* Role Inventory */}
      <Card className="p-6 overflow-hidden">
        <h2 className="text-xl font-bold mb-6">Existing Roles Library</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-black text-gray-400 uppercase text-xs">Role Name</th>
                <th className="p-4 font-black text-gray-400 uppercase text-xs">System Code</th>
                <th className="p-4 font-black text-gray-400 uppercase text-xs">Type</th>
                <th className="p-4 font-black text-gray-400 uppercase text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-700">{role.name}</td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs font-mono font-bold border">
                      {role.code}
                    </span>
                  </td>
                  <td className="p-4">
                    {role.isSystem ? (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-tight">System Managed</span>
                    ) : (
                      <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-tight">Custom Role</span>
                    )}
                  </td>
                  <td className="p-4">
                    {!role.isSystem && (
                      <button 
                        onClick={async () => { if(confirm('Delete role?')) { await roleApi.deleteRole(role._id); fetchData(); } }}
                        className="text-red-500 hover:text-red-700 font-bold text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default RoleManagement;
