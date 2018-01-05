declare var olcs: any;
declare var Cesium: any;

import * as ol from "openlayers";

const center = ol.proj.transform([-82.355036, 34.8779449], 'EPSG:4326', 'EPSG:3857');

function addCube(options = {
    center: [center[0], center[1], 250 + 10],
    width: 20,
    depth: 10,
    height: 8,
}) {

    let [x, y, z] = options.center;
    let [dx, dy, dz] = [options.width / 2, options.depth / 2, options.height / 2];

    let coordinates = [
        // -x
        [[
            [x - dx, y - dy, z - dz],
            [x - dx, y - dy, z + dz],
            [x - dx, y + dy, z + dz],
            [x - dx, y + dy, z - dz],
            [x - dx, y - dy, z - dz],
        ]],
        // +x
        [[
            [x + dx, y - dy, z - dz],
            [x + dx, y - dy, z + dz],
            [x + dx, y + dy, z + dz],
            [x + dx, y + dy, z - dz],
            [x + dx, y - dy, z - dz],
        ]],
        // -z
        [[
            [x - dx, y - dy, z - dz],
            [x + dx, y - dy, z - dz],
            [x + dx, y + dy, z - dz],
            [x - dx, y + dy, z - dz],
            [x - dx, y - dy, z - dz],
        ]],
        // +z
        [[
            [x - dx, y - dy, z + dz],
            [x + dx, y - dy, z + dz],
            [x + dx, y + dy, z + dz],
            [x - dx, y + dy, z + dz],
            [x - dx, y - dy, z + dz],
        ]],
        // -y
        [[
            [x - dx, y - dy, z - dz],
            [x + dx, y - dy, z - dz],
            [x + dx, y - dy, z + dz],
            [x - dx, y - dy, z + dz],
            [x - dx, y - dy, z - dz],
        ]],
        // +y
        [[
            [x - dx, y + dy, z - dz],
            [x + dx, y + dy, z - dz],
            [x + dx, y + dy, z + dz],
            [x - dx, y + dy, z + dz],
            [x - dx, y + dy, z - dz],
        ]],
    ];
    let geom = new ol.geom.MultiPolygon(coordinates, "XYZ");
    //geom.set('olcs.polygon_kind', 'rectangle');

    let feature = new ol.Feature({ geometry: geom });

    feature.setStyle([
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 255, 255, 1)',
                width: 3
            }),
        }),
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 255, 0, 1)',
                width: 1
            }),
            fill: new ol.style.Fill({
                color: 'rgba(20, 200, 20, 0.3)'
            })
        })]);

    return feature;
}

function run() {

    let map3d = document.createElement("div");
    map3d.className = map3d.id = "map3d";
    document.body.appendChild(map3d);

    let vectorSource = new ol.source.Vector();
    let vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });

    let ol2d = new ol.Map({
        layers: [
            new ol.layer.Tile({ source: new ol.source.OSM() }),
            vectorLayer,
        ],
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }),
        target: 'map3d',
        view: new ol.View({
            center: center,
            zoom: 15
        })
    });

    let ol3d = new olcs.OLCesium({
        map: ol2d
    });

    let scene = ol3d.getCesiumScene();

    if (1) {
        let terrainProvider = new Cesium.CesiumTerrainProvider({
            url: '//assets.agi.com/stk-terrain/world'
        });
        scene.terrainProvider = terrainProvider;
    }

    ol3d.setEnabled(true);

    vectorSource.addFeature(addCube());
}

export = run;