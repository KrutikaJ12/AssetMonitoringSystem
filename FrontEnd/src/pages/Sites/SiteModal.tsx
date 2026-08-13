import { Modal } from "../../components/ui/modal";
import InputField from "../../components/form/input/InputField";
import { useState } from "react";
import Radio from "../../components/form/input/Radio";
import Button from "../../components/ui/button/Button";
const SiteModal = ({ isOpen, onClose, mode }) => {
 const [formData, setFormData] = useState({
        siteName: "",
        location: "",
        latitude: "",
        longitude: "",
        radius: "",
        status: true,
      });
const modalConfig = {
  add: {
    title: "Add Site",
    buttonText: "Save Site",
  },
  edit: {
    title: "Edit Site",
    buttonText: "Update Site",
  },
  view: {
    title: "View Site",
    buttonText: "Close",
  },
};
  return (
   <Modal isOpen={isOpen} onClose={onClose}>
    <h2 className="text-2xl font-semibold mb-3">
       {modalConfig[mode].title}
      </h2>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="mb-2 block text-sm font-medium">Full Name</label>

          <InputField
            placeholder="Enter Site Name"
            value={formData.siteName}
            onChange={(e) =>
              setFormData({
                ...formData,
                siteName: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Location</label>

          <InputField
            placeholder="Enter Location"
            value={formData.location}
            onChange={(e) =>
              setFormData({
                ...formData,
                location: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Latitude</label>

          <InputField
            type="email"
            placeholder="Enter latitude"
            value={formData.latitude}
            onChange={(e) =>
              setFormData({
                ...formData,
                latitude: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Longitude</label>

          <InputField
            placeholder="Enter username"
            value={formData.longitude}
            onChange={(e) =>
              setFormData({
                ...formData,
                longitude: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Radius</label>

          <InputField
            type="password"
            placeholder="Enter radius"
            value={formData.radius}
            onChange={(e) =>
              setFormData({
                ...formData,
                radius: e.target.value,
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

export default SiteModal