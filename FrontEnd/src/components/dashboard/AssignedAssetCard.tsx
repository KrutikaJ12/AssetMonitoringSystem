import Badge from "../ui/badge/Badge"
import product from "/images/product/product-01.jpg"

const AssignedAssetCard = () => {
  return (
    <div className="flex w-full">
        <div className="w-[50%]">
            <img src={product}/>
        </div>
        <div className="w-[50%] flex flex-col gap-1">
            <div>EX001</div>
            <div>Excavator</div>
            <div>CAT 320</div>
            <Badge>Running</Badge>
            <button className="px-2 py-1 border rounded-lg mt-2">View Details</button>
        </div>
    </div>
  )
}

export default AssignedAssetCard