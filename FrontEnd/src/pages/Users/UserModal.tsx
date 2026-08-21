import { Modal } from "../../components/ui/modal";
import InputField from "../../components/form/input/InputField";
import { useEffect, useState } from "react";
import Radio from "../../components/form/input/Radio";
import Select from "../../components/form/Select";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import { useCreateUser, useUpdateUser } from "../../hooks/useUsers";
const UserModal = ({ isOpen, onClose, mode, selectedUser }) => {
  console.log("beforeselectedUser:", selectedUser);
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    emailId: "",
    mobileNo: "",
    // password: "",
    // confirmPassword: "",
    roleId: "",
    siteIds: "",
    isActive: true,
  });
  const roleOptions = [
    {
      value: "10",
      label: "Customer Admin",
    },
    {
      value: "11",
      label: "Site Admin",
    },
    {
      value: "12",
      label: "Operator",
    },
    {
      value: "14",
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
    if (selectedUser && (mode === "edit" || mode === "view")) {
      console.log(12)
      setFormData({
        fullName: selectedUser.fullName || "",
        userName: selectedUser.userName || "",
        emailId: selectedUser.emailId ?? "",
        mobileNo: selectedUser.mobileNo ?? "",
        roleId: selectedUser.roles?.[0]?.roleId ?? "",
        siteIds: selectedUser.sites?.map((site) => String(site.siteId)) || [],
        isActive: selectedUser.IsActive ?? true,
      });
    }

    if (mode === "add") {
      setFormData({
        fullName: "",
        userName: "",
        emailId: "",
        mobileNo: "",
        roleId: "",
        siteIds: "",
        isActive: true,
      });
    }
  }, [selectedUser, mode]);
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
  }

const handleSubmit = () => {
  if (mode === "add") {
    createUserMutation.mutate(formData, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  if (mode === "edit") {
    updateUserMutation.mutate(
      {
        userId: selectedUser.userId,
        userData: formData,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  }
};
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-semibold mb-3">{modalConfig[mode].title}</h2>
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
            value={formData.emailId}
            onChange={(e) =>
              setFormData({
                ...formData,
                emailId: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Phone Number</label>

          <InputField
            placeholder="Enter username"
            value={formData.mobileNo}
            onChange={(e) =>
              setFormData({
                ...formData,
                mobileNo: e.target.value,
              })
            }
          />
        </div>
        {/* <div>
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
        </div> */}
        <div>
          <Label>Role</Label>

          <Select
            options={roleOptions}
            placeholder="Select Role"
            value={formData.roleId}
            onChange={(value) =>
              setFormData({
                ...formData,
                roleId: value,
              })
            }
          />
        </div>
        <div>
          <Label>Assigned Sites</Label>

          <div className="mt-2 space-y-2">
            {siteOptions.map((site) => (
              <label
                key={site.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={site.value}
                  checked={formData.siteIds?.includes(site.value)}
                  onChange={(e) => {
                    const siteId = e.target.value;

                    setFormData((prev) => ({
                      ...prev,
                      siteIds: e.target.checked
                        ? [...prev.siteIds, siteId]
                        : prev.siteIds.filter((id) => id !== siteId),
                    }));
                  }}
                />

                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {site.label}
                </span>
              </label>
            ))}
          </div>
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
     <div className="flex justify-between mt-5">
  <Button
    size="md"
    variant="outline"
    onClick={onClose}
  >
    Cancel
  </Button>

  <Button onClick={handleSubmit}>
    {modalConfig[mode].buttonText}
  </Button>
</div>
    </Modal>
  );
};

export default UserModal;
