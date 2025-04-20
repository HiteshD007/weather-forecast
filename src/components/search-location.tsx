import { Label } from "./ui/label";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
 } from "./ui/dialog";
import LeafletMap from "./leaflet-map";
import { X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";


interface searchProps{
  latitude : number,
  longitude: number,
  handleCoordinateChange : (lat:number, lon:number) => void
}


const SearchLocation = ({
  latitude,
  longitude,
  handleCoordinateChange
}:searchProps) => {


  const [open , setOpen] = useState<boolean>(false);
  const [localCoordinate, setLocalCoordinate] = useState<{lat:number, lon:number}>({
    lat: latitude,
    lon: longitude
  });

  const handleLocalCoordinateChange = (lat:number, lon: number) => {
    setLocalCoordinate({lat,lon});
  };

  const handleChooseLocation = () => {
    handleCoordinateChange(localCoordinate.lat, localCoordinate.lon);
    setOpen(false);
    console.log('Local Coordinate :' ,localCoordinate.lat,localCoordinate.lon);
  }


  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Label className="h-8 bg-gray-900/80 w-full rounded-md justify-center">
          search location
        </Label>
      </DialogTrigger>
      <DialogContent className="h-full w-full !max-w-svw p-0">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>
              choose location
            </DialogTitle>
            <DialogDescription>choose and set location for weather info</DialogDescription>
          </DialogHeader>
        </VisuallyHidden>
        <LeafletMap localCoordinate={localCoordinate}  handleLocalCoordinateChange={handleLocalCoordinateChange}/>
        <DialogClose className="absolute z-10 top-20 left-3 border-2 border-gray-500 rounded-sm bg-white">
          <X size={30} color="black"/>
        </DialogClose>

        <Button variant={"secondary"} className="absolute z-10 left-5 bottom-5 cursor-pointer"
          onClick={handleChooseLocation}
        >
          Choose marker location
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SearchLocation;
