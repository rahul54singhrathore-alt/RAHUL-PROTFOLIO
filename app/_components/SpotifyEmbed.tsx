/** Spotify playlist embed. playlistId is admin-editable (profile.spotify_playlist). */
export function SpotifyEmbed({ playlistId }: { playlistId: string }) {
  if (!playlistId) return null;
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <iframe
        title="Spotify playlist"
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
        width="100%"
        height={152}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="block w-full"
      />
    </div>
  );
}
