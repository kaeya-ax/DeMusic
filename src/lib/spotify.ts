import type { User, Artist, Album,Track, Playlist } from './interfaces';

export class Spotify {
    
    static async fetchUser(accessToken: string): Promise<User> {
        try {
            console.log('Fetching user info with access token:', accessToken);
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }   
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to fetch user information: ${errorMessage}`);
            }

            const userData = await response.json();
            console.log("User data:", userData);

            const spotifyUser: User = {
                id: userData.id,
                displayName: userData.display_name,
                email: userData.email,
                followers: {
                    href: userData.followers.href,
                    total: userData.followers.total
                },
                images: userData.images.map((image: any) => ({
                    url: image.url,
                    width: image.width,
                    height: image.height
                })),
                href: userData.href
            };

            return spotifyUser;
        } catch (error) {
            console.error("Error fetching user information:", error);
            throw error;
        }
    }

    static async fetchTopTracks(accessToken: string): Promise<Track[]> {
        const apiUrl = 'https://api.spotify.com/v1/me/top/tracks';

        try {
            console.log('Fetching top tracks with access token:', accessToken);
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to fetch top tracks: ${errorMessage}`);
            }

            const data = await response.json();
            console.log("Top tracks data:", data);

            return this.mapSpotifyTracks(data.items);

        } catch (error) {
            console.error("Error fetching top tracks:", error);
            throw error;
        }
    }

    static mapSpotifyTracks(items: any[]): Track[] {
        return items.map((track: any) => ({
            id: track.id,
            name: track.name,
            artists: this.mapSpotifyArtists(track.artists),
            album: this.mapSpotifyAlbum(track.album),
            durationMs: track.duration_ms,
            explicit: track.explicit,
            popularity: track.popularity,
            previewUrl: track.preview_url,
            href: track.href,
            type: track.type,
            uri: track.uri,
            externalUrls: {
                spotify: track.external_urls.spotify
            }
        }));
    }

    static mapSpotifyArtists(artists: any[]): Artist[] {
        return artists.map((artist: any) => ({
            id: artist.id,
            name: artist.name,
            images: artist.images || [],  // Use existing images or an empty array
            type: artist.type,
            uri: artist.uri,
            externalUrls: {
                spotify: artist.external_urls.spotify
            }
        }));
    }

    static mapSpotifyAlbum(album: any): Album {
        return {
            id: album.id,
            name: album.name,
            releaseDate: album.release_date,
            totalTracks: album.total_tracks,
            images: album.images.map((image: any) => ({
                url: image.url,
                width: image.width,
                height: image.height
            })),
            type: album.type,
            uri: album.uri,
            artists: this.mapSpotifyArtists(album.artists)
        };
    }

    static async fetchTopArtists(accessToken: string, limit: number = 25): Promise<Artist[]> {
        const apiUrl = `https://api.spotify.com/v1/me/top/artists?limit=${limit}`;

        try {
            console.log('Fetching top artists with access token:', accessToken);
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to fetch top artists: ${errorMessage}`);
            }

            const data = await response.json();
            console.log("Top artists data:", data);

            return this.mapSpotifyArtists(data.items);

        } catch (error) {
            console.error("Error fetching top artists:", error);
            throw error;
        }
    }

    static async getArtistInfo(accessToken: string, artistId: string): Promise<Artist[]> {
        const apiUrl = `https://api.spotify.com/v1/artists/${artistId}`;
    
        try {
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to fetch artist information: ${errorMessage}`);
            }
    
            const artistData = await response.json();
            return this.mapSpotifyArtists(artistData); // Use mapSpotifyArtists instead of mapSpotifyArtist
    
        } catch (error) {
            console.error('Error fetching artist information:', error);
            throw error;
        }
    }
    static async fetchPlaylists(accessToken: string): Promise<Playlist[]> {
        const apiUrl = 'https://api.spotify.com/v1'
        const response = await fetch(`${apiUrl}/me/playlists`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const data = await response.json();
        return data.items;
      }

      static async fetchPlaylist(token: string, id: string): Promise<Playlist[]> {
        const apiUrl = 'https://api.spotify.com/v1';
        const response = await fetch(`${apiUrl}/playlists/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.json();
      }
}