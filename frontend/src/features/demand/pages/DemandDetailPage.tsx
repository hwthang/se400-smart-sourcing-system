import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  useDemandDetail,
  useUpdateDemand,
  useSubmitDemand,
  useApproveDemand,
  useRejectDemand,
  useAssignEmployee,
} from "../hooks/use-demand";
import { useCreateContract } from "../../contract/hooks/use-contract"; // Import hook tạo hợp đồng của bạn
import Modal from "../../../shared/ui/modal/Modal";
import {
  ArrowLeft,
  Calendar,
  ShieldAlert,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Package,
  User,
  FileCheck,
  Plus,
  Trash2,
} from "lucide-react";
import { useAuth } from "../../auth/providers/AuthProvider";
import { toast } from "react-hot-toast"; // Hoặc thư viện toast bạn đang dùng
import ConfirmDemandButton from "../components/ConfirmDemandButton";
import UpdateDemandButton from "../components/UpdateDemandButton";
import SubmitDemandButton from "../components/SubmitDemandButton";

enum DemandStatus {
  CREATED = "CREATED",
  SUBMITTED = "SUBMITTED",
  IN_REVIEW = "IN_REVIEW",
  REJECTED = "REJECTED",
  APPROVED = "APPROVED",
  CONTRACTED = "CONTRACTED",
  PENDING_CONFIRMATION = "PENDING_CONFIRMATION",
  CONFIRMED = "CONFIRMED",
}

const DemandDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // React Query Fetch Data Hook
  const { data: response, isLoading, error } = useDemandDetail(id);
  const demand = response;

  // Mutations
  const updateMutation = useUpdateDemand();
  const submitMutation = useSubmitDemand();
  const approveMutation = useApproveDemand();
  const rejectMutation = useRejectDemand();
  const assignMutation = useAssignEmployee();
  const createContractMutation = useCreateContract(); // Khai báo mutation tạo hợp đồng

  // Local Editable Form States (used when CREATED or REJECTED for Customer)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [deliveryDate, setDeliveryDate] = useState("");

  // Local state for handling dynamic technical specifications matrix
  const [specifications, setSpecifications] = useState<Record<string, string>>(
    {},
  );
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

  // Modal Control States
  const [activeModal, setActiveModal] = useState<
    | "submit"
    | "approve"
    | "reject"
    | "receive"
    | "confirm"
    | "update"
    | "create_contract"
    | null
  >(null);
  const [rejectReason, setRejectReason] = useState("");

  // Populate local form fields when data loads
  useEffect(() => {
    if (demand) {
      setName(demand.product?.name || "");
      setDescription(demand.product?.description || "");
      setSku(demand.product?.sku || "");
      setQuantity(demand.requestedQuantity || 0);
      setSpecifications(demand.product?.specifications || {});
      if (demand.requestedDeliveryDate) {
        setDeliveryDate(
          new Date(demand.requestedDeliveryDate).toISOString().split("T")[0],
        );
      }
    }
  }, [demand]);

  if (isLoading) {
    return (
      <div className="p-12 text-center font-medium text-gray-400">
        Loading demand ledger details...
      </div>
    );
  }

  if (error || !demand) {
    return (
      <div className="p-12 text-center font-medium text-rose-600">
        Failed to locate the targeted record.
      </div>
    );
  }

  const isCustomer = user?.role === "CUSTOMER";
  const isEmployee = user?.role === "EMPLOYEE";
  const status = demand.status as DemandStatus;

  // Check if form is editable by customer
  const isFormEditable =
    isCustomer &&
    (status === DemandStatus.CREATED || status === DemandStatus.REJECTED);

  // Dynamic Specification Operations Handlers
  const handleUpdateSpec = (key: string, value: string) => {
    setSpecifications((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddSpec = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) return;
    setSpecifications((prev) => ({
      ...prev,
      [newSpecKey.trim()]: newSpecValue.trim(),
    }));
    setNewSpecKey("");
    setNewSpecValue("");
  };

  const handleDeleteSpec = (keyToDelete: string) => {
    setSpecifications((prev) => {
      const updated = { ...prev };
      delete updated[keyToDelete];
      return updated;
    });
  };

  // Hàm xử lý gọi API tạo hợp đồng từ phía Employee
  const handleCreateContractSubmit = () => {
    // Truyền demandId vào hàm tạo tùy thuộc cấu trúc API của bạn (ví dụ: demandId)
    createContractMutation.mutate(demand.id, {
      onSuccess: (newContractData: any) => {
        setActiveModal(null);
        // Sau khi thành công, chuyển hướng trực tiếp sang trang quản lý Contract detail
        // Giả sử API trả về data có chứa id contract mới, hoặc navigate sang danh sách
        const contractId = newContractData?.id || demand.id;
        navigate(`/console/contracts/${contractId}`);
      },
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8 bg-gradient-to-br from-white to-blue-50/40 min-h-screen space-y-6 text-left">
      {/* HEADER NAVIGATION */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider hover:text-blue-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard Log
      </button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-4 gap-4">
        <div>
          <span className="text-xs font-mono px-2 py-0.5 bg-gray-100 rounded text-gray-500 font-semibold">
            {demand.id}
          </span>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mt-1">
            {isFormEditable
              ? "Modify Operational Request"
              : demand.product?.name}
          </h1>
        </div>
        <div className="shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider bg-blue-900 text-white shadow-sm">
            Status: {status.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      {/* CORE SPECIFICATIONS SHEET & FORM SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-md p-5 md:p-6 shadow-sm lg:col-span-2 space-y-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
            <Package className="w-4 h-4 text-blue-800" /> Material Criteria
          </h3>

          {/* Primary Form Input Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400">
                Material Name
              </label>
              <input
                type="text"
                value={name}
                disabled={!isFormEditable}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50/50 disabled:bg-gray-50 text-gray-900 font-medium px-3 py-2 rounded border border-gray-100 disabled:border-transparent text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400">
                SKU Reference Hash
              </label>
              <input
                type="text"
                value={sku}
                disabled={!isFormEditable}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-gray-50/50 disabled:bg-gray-50 text-gray-900 font-mono px-3 py-2 rounded border border-gray-100 disabled:border-transparent text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400">
                Requested Volume (Units)
              </label>
              <input
                type="number"
                value={quantity}
                disabled={!isFormEditable}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-gray-50/50 disabled:bg-gray-50 text-gray-900 font-mono font-bold px-3 py-2 rounded border border-gray-100 disabled:border-transparent text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400">
                Target Delivery Horizon
              </label>
              <input
                type="date"
                value={deliveryDate}
                disabled={!isFormEditable}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full bg-gray-50/50 disabled:bg-gray-50 text-gray-900 font-medium px-3 py-2 rounded border border-gray-100 disabled:border-transparent text-sm focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-400">
                Description Metadata
              </label>
              <textarea
                value={description}
                rows={3}
                disabled={!isFormEditable}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50/50 disabled:bg-gray-50 text-gray-900 px-3 py-2 rounded border border-gray-100 disabled:border-transparent text-sm focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* DYNAMIC SPECIFICATIONS ARCHITECTURE ELEMENT */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Technical Matrix Parameters
            </span>

            <div className="space-y-2">
              {Object.entries(specifications).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center gap-2 bg-gray-50/60 p-2 rounded border border-gray-100/50"
                >
                  <span className="text-xs font-mono font-bold text-gray-500 bg-gray-200/60 px-2 py-1 rounded min-w-[120px] max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {key}
                  </span>
                  <input
                    type="text"
                    value={val}
                    disabled={!isFormEditable}
                    onChange={(e) => handleUpdateSpec(key, e.target.value)}
                    className="flex-1 bg-transparent text-xs font-semibold text-gray-700 px-2 py-1 focus:outline-none rounded disabled:bg-transparent"
                  />
                  {isFormEditable && (
                    <button
                      type="button"
                      onClick={() => handleDeleteSpec(key)}
                      className="p-1 text-gray-400 hover:text-rose-600 transition-colors rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isFormEditable && (
              <div className="bg-blue-50/30 border border-dashed border-blue-200 rounded p-3 mt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Key (e.g. Weight)"
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  className="bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-800 flex-1"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 12kg)"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  className="bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-800 flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddSpec}
                  disabled={!newSpecKey.trim() || !newSpecValue.trim()}
                  className="bg-blue-800 text-white rounded text-xs px-3 py-1 font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            {demand.status === DemandStatus.PENDING_CONFIRMATION && (
              <ConfirmDemandButton demand={demand} />
            )}
          </div>
        </div>

        {/* SIDEBAR VIEW METADATA CONTROLS */}
        <div className="space-y-6">
          <div className="bg-white rounded-md p-5 md:p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
              <User className="w-4 h-4 text-blue-800" /> Client Account
            </h3>
            <div className="text-xs space-y-3 text-gray-600">
              <div>
                <span className="text-gray-400 block font-medium">
                  Username Handle
                </span>
                <span className="font-semibold text-gray-800 text-sm">
                  {demand.customer?.username}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">
                  Email Channel
                </span>
                <span className="font-mono font-medium">
                  {demand.customer?.email}
                </span>
              </div>
            </div>
          </div>

          {/* ADMIN OPERATIONS PANEL */}
          {isEmployee && (
            <div className="bg-white rounded-md p-5 md:p-6 shadow-sm border border-blue-100 space-y-4">
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <FileText className="w-4 h-4" /> Administration Panel
              </h3>
              <div className="flex flex-col gap-2">
                {status === DemandStatus.SUBMITTED && (
                  <button
                    onClick={() => setActiveModal("receive")}
                    className="w-full bg-blue-800 text-white text-xs font-bold py-2.5 rounded hover:bg-blue-900 transition-all text-center shadow-sm"
                  >
                    Receive Request Ticket
                  </button>
                )}
                {status === DemandStatus.IN_REVIEW && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveModal("reject")}
                      className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold py-2.5 rounded hover:bg-rose-100 transition-all text-center"
                    >
                      Reject Parameters
                    </button>
                    <button
                      onClick={() => setActiveModal("approve")}
                      className="bg-emerald-600 text-white text-xs font-bold py-2.5 rounded hover:bg-emerald-700 transition-all text-center shadow-sm"
                    >
                      Accept & Approve
                    </button>
                  </div>
                )}

                {/* HIỂN THỊ NÚT TẠO HỢP ĐỒNG KHI ĐÃ ĐƯỢC APPROVE */}
                {status === DemandStatus.APPROVED && (
                  <button
                    onClick={() => setActiveModal("create_contract")}
                    disabled={createContractMutation.isPending}
                    className="w-full bg-purple-700 text-white text-xs font-bold py-2.5 rounded hover:bg-purple-800 disabled:opacity-50 transition-all text-center shadow-sm flex items-center justify-center gap-1"
                  >
                    {createContractMutation.isPending
                      ? "Generating..."
                      : "Generate Contract"}
                  </button>
                )}
              </div>
            </div>
          )}

          {isCustomer && (
            <div className="bg-white rounded-md p-5 md:p-6 shadow-sm border border-blue-100 space-y-4">
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <FileText className="w-4 h-4" /> Customer Panel
              </h3>
              <div className="flex flex-col gap-2">
                {(status == DemandStatus.CREATED ||
                  status == DemandStatus.REJECTED) && (
                  <>
                    <UpdateDemandButton
                      demand={{
                        id: demand.id,

                        product: {
                          name,
                          description,
                          sku,
                          specifications: specifications,
                        },
                        requestedQuantity: Number(quantity),
                        requestedDeliveryDate: new Date(deliveryDate),
                      }}
                    />
                    <SubmitDemandButton demandId={demand.id} />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL XÁC NHẬN TẠO HỢP ĐỒNG */}
      <Modal
        open={activeModal === "create_contract"}
        onClose={() =>
          !createContractMutation.isPending && setActiveModal(null)
        }
        title="Initialize Contract"
      >
        <div className="space-y-4 text-sm text-gray-600 text-left">
          <p>
            You are about to generate an official procurement contract for
            demand requirement record <strong>{demand.id}</strong>. This action
            will stage the agreed operational parameters for subsequent client
            verification and confirmation.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              disabled={createContractMutation.isPending}
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 border border-gray-200 rounded text-xs font-semibold disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={createContractMutation.isPending}
              onClick={handleCreateContractSubmit}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded text-xs font-bold disabled:opacity-50 transition-colors"
            >
              {createContractMutation.isPending
                ? "Processing..."
                : "Confirm & Generate"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={activeModal === "receive"}
        onClose={() => setActiveModal(null)}
        title="Acquire Record Ownership"
      >
        <div className="space-y-4 text-sm text-gray-600 text-left">
          <p>
            Assigning your Identity Hash updates this status directly to{" "}
            <strong>IN_REVIEW</strong>.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 border border-gray-200 rounded text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                assignMutation.mutate(
                  { id: demand.id, employeeId: user?.id || "fallback-id" },
                  { onSuccess: () => setActiveModal(null) },
                )
              }
              className="px-4 py-2 bg-blue-800 text-white rounded text-xs font-bold"
            >
              Confirm Assignment
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={activeModal === "reject"}
        onClose={() => setActiveModal(null)}
        title="Decline Allocation Parameters"
      >
        <div className="space-y-4 text-left">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            State Reason for Exception Defect
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
            placeholder="Specify reason..."
            className="w-full text-sm text-gray-900 border border-gray-200 rounded p-2 focus:outline-none resize-none"
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 border border-gray-200 rounded text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              disabled={!rejectReason.trim()}
              onClick={() =>
                rejectMutation.mutate(
                  { id: demand.id, reason: rejectReason },
                  { onSuccess: () => setActiveModal(null) },
                )
              }
              className="px-4 py-2 bg-rose-600 text-white rounded text-xs font-bold"
            >
              Decline Profile
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={activeModal === "approve"}
        onClose={() => setActiveModal(null)}
        title="Approve Sourcing Profile"
      >
        <div className="space-y-4 text-sm text-gray-600 text-left">
          <p>
            Authorization moves this profile row into the{" "}
            <strong>APPROVED</strong> tracking queue.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 border border-gray-200 rounded text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                approveMutation.mutate(demand.id, {
                  onSuccess: () => setActiveModal(null),
                })
              }
              className="px-4 py-2 bg-emerald-600 text-white rounded text-xs font-bold"
            >
              Approve Asset Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DemandDetailPage;
