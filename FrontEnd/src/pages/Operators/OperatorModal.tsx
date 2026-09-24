import { Modal } from "../../components/ui/modal";
import InputField from "../../components/form/input/InputField";
import { useEffect, useState } from "react";
import Radio from "../../components/form/input/Radio";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import { useCreateOperator, useUpdateOperator } from "../../hooks/useOperators";
import { useGetAssets } from "../../hooks/useAssets";

const OperatorModal = ({
  isOpen,
  onClose,
  mode,
  operators,
  selectedOperator,
}) => {
  const createOperatorMutation = useCreateOperator();
  const updateOperatorMutation = useUpdateOperator();
  const [formData, setFormData] = useState({
    operatorName: "",
    mobileNo: "",
    licenseNo: "",
    siteId: "",
    assetId: "",
    isActive: true,
  });
  // console.log("formData.siteId:", formData.siteId);
  // const { data } = useGetAssets(formData.siteId);
  // console.log("assets:", data.assetData);
  const modalConfig = {
    add: {
      title: "Add Operator",
      buttonText: "Save Operator",
    },
    edit: {
      title: "Edit Operator",
      buttonText: "Update Operator",
    },
    view: {
      title: "View Operator",
      buttonText: "Close",
    },
  };
  //This are actually the assets assigned to the operator on that particular site
  //but we have to get the data from assets api for the available assets api in future
  // const assetOptions = (operators || [])?.map((asset) => ({
  //   value: asset.AssetID,
  //   label: `${asset.AssetCode} - ${asset.AssetName} (${asset.AssetTypeName})`,
  // }));
  const assetOptions = [
  {
    value: "2",
    label: "FL001 - Forklift-01 (Forklift)",
  },
  {
    value: "3",
    label: "FL002 - Forklift-02 (Forklift)",
  },
  {
    value: "4",
    label: "EFL001 - Electric Forklift-01 (Electric Forklift)",
  },
  {
    value: "5",
    label: "EFL002 - Electric Forklift-02 (Electric Forklift)",
  },
  {
    value: "6",
    label: "DFL001 - Diesel Forklift-01 (Diesel Forklift)",
  },
  {
    value: "7",
    label: "EX001 - Excavator-01 (Excavator)",
  },
  {
    value: "8",
    label: "BL001 - Backhoe Loader-01 (Backhoe Loader)",
  },
  {
    value: "9",
    label: "FL006 - Forklift-06 (Forklift)",
  },
  {
    value: "10",
    label: "Saquib - aba (Forklift)",
  },
  {
    value: "11",
    label: "22333 - Pune (Forklift)",
  },
  {
    value: "12",
    label: "343456 - Mumbai (Excavator)",
  },
  {
    value: "13",
    label: "6767 - Nirmal (Backhoe Loader)",
  },
  {
    value: "14",
    label: "A0004 - Forklift (Electric Forklift)",
  },
  {
    value: "15",
    label: "TEST001 - Test Forklift (Forklift)",
  },
  {
    value: "16",
    label: "TEST001 - Test Forklift (Forklift)",
  },
  {
    value: "17",
    label: "TEST001 - Test Forklift (Forklift)",
  },
  {
    value: "18",
    label: "TEST001 - Test Forklift-01 (Forklift)",
  },
];
  console.log("Assetoptions",assetOptions)
  const siteOptions = operators?.map((site) => ({
    value: site.SiteID,
    label: site.SiteName,
  }));
  useEffect(() => {
    if (selectedOperator && (mode === "edit" || mode === "view")) {
      setFormData({
        operatorName: selectedOperator.OperatorName || "",
        mobileNo: selectedOperator.MobileNo || "",
        licenseNo: selectedOperator.LicenseNo ?? "",
        siteId: selectedOperator.SiteID ?? "",
        assetId: selectedOperator.AssetID ?? "",
        isActive: selectedOperator.IsActive ?? true,
      });
    }

    if (mode === "add") {
      setFormData({
        operatorName: "",
        mobileNo: "",
        licenseNo: "",
        siteId: "",
        assetId: "",
        isActive: true,
      });
    }
  }, [selectedOperator, mode]);

  const handleSubmit = () => {
    if (mode === "add") {
      createOperatorMutation.mutate(formData, {
        onSuccess: () => {
          onClose(); // ✅ Save Operator ke baad modal close
        },
      });
    }

    if (mode === "edit") {
      updateOperatorMutation.mutate(
        {
          operatorId: selectedOperator.OperatorID,
          operatorData: formData,
        },

        {
          onSuccess: () => {
            onClose(); // ✅ Update Operator ke baad modal close
          },
        },
      );
    }
  };
  console.log("formData", formData);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-semibold mb-3">{modalConfig[mode].title}</h2>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Operator Name
          </label>

          <InputField
            placeholder="Enter Site Name"
            value={formData.operatorName}
            onChange={(e) =>
              setFormData({
                ...formData,
                operatorName: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Mobile No</label>

          <InputField
            placeholder="Enter Mobile No"
            value={formData.mobileNo}
            onChange={(e) =>
              setFormData({
                ...formData,
                mobileNo: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">
            License Number
          </label>

          <InputField
            type="email"
            placeholder="Enter License Number"
            value={formData.licenseNo}
            onChange={(e) =>
              setFormData({
                ...formData,
                licenseNo: e.target.value,
              })
            }
          />
        </div>
        {/* <div>
          <label className="mb-2 block text-sm font-medium">Asset Code</label>

          <InputField
            placeholder="Enter Asset Code"
            value={formData.assetCode}
            onChange={(e) =>
              setFormData({
                ...formData,
                assetCode: e.target.value,
              })
            }
          />
        </div> */}

        {/* <div>
          <Label>Asset Type</Label>
          <Select
            options={assetTypeOptions}
            placeholder="Select Asset Type"
            value={formData.assetTypeId}
            onChange={(value) =>
              setFormData({
                ...formData,
                assetTypeId: value,
              })
            }
          />
        </div> */}
        <div>
          <Label>Assigned Site</Label>

          <Select
            options={siteOptions}
            value={formData.siteId}
            placeholder="Select Site"
            onChange={(value) => {
              console.log("Selected site:", value);

              setFormData((prev) => ({
                ...prev,
                siteId: value,
                assetId: "",
              }));
            }}
          />
        </div>
        <div>
          <Label>Assigned Asset</Label>

          <Select
            options={assetOptions}
            placeholder={formData.siteId ? "Select Asset" : "Select site first"}
            value={formData.assetId}
            onChange={(value) =>
              setFormData({
                ...formData,
                assetId: value,
              })
            }
            disabled={!formData.siteId}
          />
        </div>
        <div>
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-white">
              Status
            </label>

            <div className="flex gap-6">
              <Radio
                id="active"
                name="status"
                value="Active"
                label="Active"
                checked={formData.isActive}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    isActive: value,
                  })
                }
              />

              <Radio
                id="inactive"
                name="status"
                value="Inactive"
                label="Inactive"
                checked={!formData.isActive}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    isActive: value,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex justify-between mt-5">
        {/* ✅ Cancel also closes modal */}
        <Button size="md" variant="outline" onClick={onClose}>
          Cancel
        </Button>

        {/* Save / Update */}
        <Button onClick={handleSubmit}>{modalConfig[mode].buttonText}</Button>
      </div>
    </Modal>
  );
};

export default OperatorModal;
