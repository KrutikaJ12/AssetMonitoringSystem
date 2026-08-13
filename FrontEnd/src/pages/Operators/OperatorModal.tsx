import { Modal } from "../../components/ui/modal";
import InputField from "../../components/form/input/InputField";
import { useState } from "react";
import Radio from "../../components/form/input/Radio";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
const OperatorModal = ({ isOpen, onClose, mode }) => {
 const [formData, setFormData] = useState({
        operator: "",
        mobile: "",
        licenseNo: "",
        rfidcard: "",
        site: "",
        status: true,
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
 const siteOptions = [
    {
      value: "1",
      label: "Mumbai Plant",
    },
    {
      value: "2",
      label: "Pune Warehouse",
    },
    {
      value: "3",
      label: "Chennai Yard",
    },
  ];
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
            value={formData.operator}
            onChange={(e) =>
              setFormData({
                ...formData,
                operator: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Mobile No</label>

          <InputField
            placeholder="Enter Mobile No"
            value={formData.mobile}
            onChange={(e) =>
              setFormData({
                ...formData,
                mobile: e.target.value,
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
          <label className="mb-2 block text-sm font-medium">RFID Card No</label>

          <InputField
            placeholder="Enter RFID Card No"
            value={formData.rfidcard}
            onChange={(e) =>
              setFormData({
                ...formData,
                rfidcard: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Label>Assigned Site</Label>

          <Select
            options={siteOptions}
            placeholder="Select Site"
            value={formData.site}
            onChange={(value) =>
              setFormData({
                ...formData,
                site: value,
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
                checked={formData.status === "Active"}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value,
                  })
                }
              />

              <Radio
                id="inactive"
                name="status"
                value="Inactive"
                label="Inactive"
                checked={formData.status === "Inactive"}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-5">
        <Button size="md" variant="outline">
          Cancel
        </Button>
        <Button>{modalConfig[mode].buttonText}</Button>
      </div>
   </Modal>
  )
}

export default OperatorModal;