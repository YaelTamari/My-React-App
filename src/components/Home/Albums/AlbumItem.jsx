import { Link, useParams } from "react-router-dom"; // חשוב עבור הלינקים
import "../Albums/Albums.css";

const AlbumItem = ({ album }) => {

  const { userId } = useParams(); // חייבים לחלץ את ה-userId מה-URL הנוכחי

  return (
    <div className="album-item-card">
      {/* <Link to={`/albums/${album.id}/photos`}> */}
      <Link to={`/users/${userId}/albums/${album.id}/photos`}>
        <span>{album.id}</span> - <span>{album.title}</span>
      </Link>
    </div>
  );
};
export default AlbumItem;