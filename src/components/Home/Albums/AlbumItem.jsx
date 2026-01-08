import { Link } from "react-router-dom"; // חשוב עבור הלינקים


const AlbumItem = ({ album }) => {
  return (
    <div className="album-item-card">
      <Link to={`/albums/${album.id}/photos`}>
        <span>{album.id}</span> - <span>{album.title}</span>
      </Link>
    </div>
  );
};
export default AlbumItem;


// import { Link } from "react-router-dom"; // חשוב עבור הלינקים


// const AlbumItem = ({ album }) => {
//   return (
//     <div className="album-item-card">
//       <Link to={`/albums/${album.id}/photos`}>
//         <span>{album.id}</span> - <span>{album.title}</span>
//       </Link>
//     </div>
//   );
// };
// export default AlbumItem;
