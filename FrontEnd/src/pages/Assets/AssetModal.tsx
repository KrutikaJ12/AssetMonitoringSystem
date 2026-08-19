import { Modal } from "../../components/ui/modal";
import InputField from "../../components/form/input/InputField";
import { useEffect, useState } from "react";
import Radio from "../../components/form/input/Radio";
import Button from "../../components/ui/button/Button";
import { useCreateSite, useUpdateSite } from "../../hooks/useSites";
import Select from "../../components/form/Select";
import Label from "../../components/form/Label";
import { useCreateAsset, useUpdateAsset } from "../../hooks/useAssets";
const AssetModal = ({ isOpen, onClose, mode, assets, selectedAsset }) => {
  const createAssetMutation = useCreateAsset();
  const updateAssetMutation = useUpdateAsset()
  const updateSiteMutation = useUpdateSite();
  const [formData, setFormData] = useState({
    assetCode: "",
    assetName: "",
    assetTypeId: "",
    regNo: "",
    siteId: "",
    status: "IDLE",
  });
  const modalConfig = {
    add: {
      title: "Add Asset",
      buttonText: "Save Asset",
    },
    edit: {
      title: "Edit Asset",
      buttonText: "Update Asset",
    },
    view: {
      title: "View Asset",
      buttonText: "Close",
    },
  };
  const status = [
    {
      value: "RUNNING",
      label: "RUNNING",
    },
    {
      value: "IDLE",
      label: "IDLE",
    },
    {
      value: "STOPPED",
      label: "STOPPED",
    },
    {
      value: "OFFLINE",
      label: "OFFLINE",
    },
  ];
  const siteOptions = assets?.map((site) => ({
    value: site.SiteID,
    label: site.SiteName,
  }));
  const assetTypeOptions = assets
  ?.map((asset) => ({
    value: asset.AssetTypeID,
    label: asset.AssetTypeName,
  }))
//   .filter(
//     (option, index, self) =>
//       index === self.findIndex(
//         (item) => item.value === option.value
//       )
//   );
  console.log("formData", formData,assetTypeOptions);
  useEffect(() => {
    if (selectedAsset && (mode === "edit" || mode === "view")) {
      setFormData({
        assetCode: selectedAsset.AssetCode || "",
        assetName: selectedAsset.AssetName || "",
        assetTypeId: selectedAsset.AssetTypeID ?? "",
        regNo: selectedAsset.RegistrationNo ?? "",
        siteId: selectedAsset.SiteID ?? "",
        status: selectedAsset.Status ?? true,
      });
    }

    if (mode === "add") {
      setFormData({
        assetCode: "",
        assetName: "",
        assetTypeId: "",
        regNo: "",
        siteId: "",
        status: "",
      });
    }
  }, [selectedAsset, mode]);
  const handleSubmit = () => {
    if (mode === "add") {
      createAssetMutation.mutate(formData);
    }

    if (mode === "edit") {
      updateAssetMutation.mutate({
        assetId: selectedAsset.AssetID,
        assetData: formData,
      });
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-semibold mb-3">{modalConfig[mode].title}</h2>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="mb-2 block text-sm font-medium">Asset Code</label>

          <InputField
            placeholder="Enter Site Name"
            value={formData.assetCode}
            onChange={(e) =>
              setFormData({
                ...formData,
                assetCode: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Asset Name</label>

          <InputField
            placeholder="Enter Location"
            value={formData.assetName}
            onChange={(e) =>
              setFormData({
                ...formData,
                assetName: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">
            Registration No
          </label>

          <InputField
            type="email"
            placeholder="Enter Registration No"
            value={formData.regNo}
            onChange={(e) =>
              setFormData({
                ...formData,
                regNo: e.target.value,
              })
            }
          />
        </div>
        <div>
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
        </div>
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
          <Label>Status</Label>
          <Select
            options={status}
            placeholder="Select Status"
            value={formData.status}
            onChange={(value) =>
              setFormData({
                ...formData,
                status: value,
              })
            }
          />
        </div>
      </div>
      <div className="flex justify-between mt-5">
        <Button size="md" variant="outline">
          Cancel
        </Button>
        <Button onClick={handleSubmit}>{modalConfig[mode].buttonText}</Button>
      </div>
    </Modal>
  );
};

export default AssetModal;
