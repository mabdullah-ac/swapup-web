import "./NFTCard.scss";

function NFTCard({ nft, ...rest }) {
  return (
    <div className="nft-card">
      <img {...rest} src={nft.rawMetadata.image} alt={nft.rawMetadata.name} />
      <p>{`${nft.title} ${nft.tokenId}`}</p>
    </div>
  );
}

export default NFTCard;
