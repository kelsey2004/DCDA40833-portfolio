import folium
import pandas as pd
import requests

# MapBox access token. This my default public token. This is how I will be able to access MapBox's API to use my own custom map styles.
ACCESS_TOKEN = 'pk.eyJ1Ijoia2Vsc2V5c2FuY2hleiIsImEiOiJjbTF6bHh6cDkwOWZ5MmxwcTlpNGpya2d0In0.vvgJ7g1B8e02vHfYChGD5Q'

# Mapbox custom style tile URL. It is reading my custom map style 
MAPBOX_TILE_URL = (
    'https://api.mapbox.com/styles/v1/kelseysanchez/'
    'cmm3w992g002n01s85ccla230/tiles/256/{z}/{x}/{y}@2x'
    f'?access_token={ACCESS_TOKEN}'
)

# Marker colour / icon per location type # Assigning a specific color and icon for each type of location. This what shows up when you hover over the location. 
TYPE_STYLES = {
    'Cafe':           {'color': 'cadetblue',   'icon': 'coffee'},
    'Recreation':     {'color': 'pink',    'icon': 'face-smile'},
    'Cultural':       {'color': 'purple',   'icon': 'university'},
    'Resturant':      {'color': 'red',      'icon': 'cutlery'},
    'Local Business': {'color': 'lightblue',     'icon': 'shopping-cart'},
}
DEFAULT_STYLE = {'color': 'gray', 'icon': 'info-circle'}


# ── Geocoding helper ────────────────────────────────────────────────────────
def geocode(address: str) -> tuple:          # It is converting the address which is string into geogrpahic coordinates so the actually markers can be placed on the map accordingly.
    """Return (lat, lon) for *address* via the Mapbox Geocoding API."""
    url = 'https://api.mapbox.com/search/geocode/v6/forward'
    params = {'q': address, 'access_token': ACCESS_TOKEN, 'limit': 1}
    resp = requests.get(url, params=params)
    resp.raise_for_status()
    data = resp.json()
    coords = data['features'][0]['geometry']['coordinates']   # [lon, lat]
    return coords[1], coords[0]


# ── Read CSV ─────────────────────────────────────────────────────────────────
df = pd.read_csv('Hometown_Locations.csv', encoding='latin-1')

# Removing any leading or trailingwhitespaces from column Name and Type. This is important to avoid early on errors. 
df.columns = df.columns.str.strip()
df['Type'] = df['Type'].str.strip()

# Geocode every address
print('Geocoding addresses …')
lats, lons = [], [] #creating empty lists that will store the latitude and longitude values 
for address in df['Address']: #looking specifically at the address column.This convets the string into geogrpahic coordinates. 
    lat, lon = geocode(address)
    lats.append(lat) # storing each of the results in the lists 
    lons.append(lon)
    print(f'  {address}  →  ({lat:.5f}, {lon:.5f})')
df['Latitude'] = lats
df['Longitude'] = lons


# ── Build the Folium map ────────────────────────────────────────────────────
center_lat = df['Latitude'].mean() #calcualting the average of each in order to find the center point of the map. This is important because it will make sure that all the markers are visible when the map is first loaded.
center_lon = df['Longitude'].mean() 

m = folium.Map(
    location=[center_lat, center_lon],
    zoom_start=13,
    tiles=MAPBOX_TILE_URL, #using the custom map style that I created in MapBox. This is what gives the map the unique look.
    attr='Mapbox',
)

# Add markers
for _, row in df.iterrows():
    style = TYPE_STYLES.get(row['Type'], DEFAULT_STYLE)

    # Build HTML pop-up with name, description, and image
    popup_html = f"""
    <div style="width:280px; font-family:Arial, sans-serif;">
        <h4 style="margin:0 0 6px 0;">{row['Name']}</h4>
        <p style="font-size:12px; color:#555; margin:0 0 8px 0;">
            <b>Type:</b> {row['Type']}
        </p>
        <img src="{row['Image_URL'].strip()}"
             style="width:100%; border-radius:6px; margin-bottom:8px;"
             alt="{row['Name']}">
        <p style="font-size:13px; line-height:1.4; margin:0;">
            {row['Description']}
        </p>
    </div>
    """

    folium.Marker(
        location=[row['Latitude'], row['Longitude']],
        popup=folium.Popup(popup_html, max_width=320),
        tooltip=row['Name'],
        icon=folium.Icon(color=style['color'], icon=style['icon'], prefix='fa'),
    ).add_to(m)


# ── Save ─────────────────────────────────────────────────────────────────────
output_file = 'Hometown_map.html'
m.save(output_file)
print(f'\nMap saved to {output_file}')
