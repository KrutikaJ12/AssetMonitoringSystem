import { Modal } from "../../components/ui/modal";
import InputField from "../../components/form/input/InputField";
import { useEffect, useState } from "react";
import Radio from "../../components/form/input/Radio";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import { useCreateOperator, useUpdateOperator } from "../../hooks/useOperators";




   const OperatorModal = ({ isOpen, onClose, mode,operators,selectedOperator}) => {
   const createOperatorMutation = useCreateOperator(); 
   const updateOperatorMutation = useUpdateOperator(); 
 const [formData, setFormData] = useState({
        operatorName: "",
        mobileNo: "",
        licenseNo: "",
        rfidcard: "",
        siteId: "",
        isActive: true,
        assetCode:"",
      });
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
            rfidcard: selectedOperator.RFIDCardNo ?? "",
            siteId: selectedOperator.SiteID ?? "",
            isActive: selectedOperator.IsActive ?? true,
            assetCode:selectedOperator.assetCode,
        });
    }

    if (mode === "add") {
        setFormData({
        operatorName: "",
        mobileNo: "",
        licenseNo: "",
        rfidcard: "",
        siteId: "",
        isActive: true,
        assetCode:""
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
      }
    );
  }
};
console.log("formData",formData)
  return (
   <Modal isOpen={isOpen} onClose={onClose}>
    <h2 className="text-2xl font-semibold mb-3">
       {modalConfig[mode].title}
      </h2>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="mb-2 block text-sm font-medium">Operator Name</label>

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
          <label className="mb-2 block text-sm font-medium">License Number</label>

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
        <div>
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
        </div>

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
            placeholder="Select Site"
            value={formData.siteId}
            onChange={(value) =>
              setFormData({
                ...formData,
                siteId: value,
              })
            }
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
                checked={formData.isActive }
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
                checked={!formData.isActive }
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
        <Button
          size="md"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>

        {/* Save / Update */}
        <Button onClick={handleSubmit}>
          {modalConfig[mode].buttonText}
        </Button>

      </div>
   </Modal>
  )
}

export default OperatorModal;