import { Modal } from "../../components/ui/modal";
import InputField from "../../components/form/input/InputField";
import { useEffect, useState } from "react";
import Radio from "../../components/form/input/Radio";
import Select from "../../components/form/Select";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
const UserModal = ({ isOpen, onClose, mode, user }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "",
    site: "",
    isActive: true,
  });
  const roleOptions = [
    {
      value: "CUSTOMER_ADMIN",
      label: "Customer Admin",
    },
    {
      value: "SITE_ADMIN",
      label: "Site Admin",
    },
    {
      value: "OPERATOR",
      label: "Operator",
    },
    {
      value: "REPORT_USER",
      label: "Report User",
    },
  ];
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
  useEffect(() => {
    if (mode === "edit" && user) {
        setFormData({
            fullName: user.FullName,
            userName: user.UserName,
            email: user.Email,
            phoneNumber: user.PhoneNumber,
            role: user.RoleID,
            site: user.SiteID,
            isActive: user.IsActive ? "Active" : "Inactive",
            password: "",
            confirmPassword: "",
        });
    }
}, [mode, user]);
const modalConfig = {
  add: {
    title: "Add User",
    buttonText: "Save User",
  },
  edit: {
    title: "Edit User",
    buttonText: "Update User",
  },
  view: {
    title: "View User",
    buttonText: "Close",
  },
};
  console.log("mode", mode);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-semibold mb-3">
       {modalConfig[mode].title}
      </h2>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="mb-2 block text-sm font-medium">Full Name</label>

          <InputField
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({
                ...formData,
                fullName: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Username</label>

          <InputField
            placeholder="Enter username"
            value={formData.userName}
            onChange={(e) =>
              setFormData({
                ...formData,
                userName: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Email</label>

          <InputField
            type="email"
            placeholder="Enter Email"
            value={formData.userName}
            onChange={(e) =>
              setFormData({
                ...formData,
                userName: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Phone Number</label>

          <InputField
            placeholder="Enter username"
            value={formData.userName}
            onChange={(e) =>
              setFormData({
                ...formData,
                userName: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Password</label>

          <InputField
            type="password"
            placeholder="Enter username"
            value={formData.userName}
            onChange={(e) =>
              setFormData({
                ...formData,
                userName: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">
            Confirm Password
          </label>

          <InputField
            type="password"
            placeholder="Enter username"
            value={formData.userName}
            onChange={(e) =>
              setFormData({
                ...formData,
                userName: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Label>Role</Label>

          <Select
            options={roleOptions}
            placeholder="Select Role"
            value={formData.role}
            onChange={(value) =>
              setFormData({
                ...formData,
                role: value,
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
  );
};

export default UserModal;
