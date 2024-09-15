import { Card, CardContent, CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PathCardContent from "./PathCardContent";

/**
 * PathCard component that displays a path's name, link, drive time, and distance.
 * @param {Object} props - The component props
 * @param {Object} props.path - The path object
 * @returns {JSX.Element}
 */
const PathCard = ({ path }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    // Navigate to the path details page with the path object in the state
    navigate(`/paths/${path.id}`, { state: { path: path } });
  };

  return (
    <Card sx={{ width: "300px" }}>
      <CardActionArea onClick={handleNavigate}>
        <CardContent>
          <PathCardContent path={path} />
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PathCard;
