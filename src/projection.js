import * as L from 'leaflet'

function forward (p) {
  return convertLL2MC(p)
}

function inverse (p) {
  return convertMC2LL(p)
}

function convertLL2MC (p) {
  p.x = getLoop(p.x, -180, 180)
  p.y = getRange(p.y, -74, 74)
  for (let i = 0; i < aLLBAND.length; i++) {
    if (p.y >= aLLBAND[i]) {
      return convertor(p, aLL2MC[i])
    }
  }
  for (let i = aLLBAND.length - 1; i >= 0; i--) {
    if (p.y <= -aLLBAND[i]) {
      return convertor(p, aLL2MC[i])
    }
  }
}

function convertMC2LL (p) {
  const yAbs = Math.abs(p.y)
  for (let i = 0; i < aMCBAND.length; i++) {
    if (yAbs >= aMCBAND[i]) {
      return convertor(p, aMC2LL[i])
    }
  }
}

function convertor (p, table) {
  const d = Math.abs(p.y) / table[9]
  let x = table[0] + (table[1] * Math.abs(p.x))
  let y = table[2]
  for (let i = 3; i <= 8; i++) {
    y += table[i] * Math.pow(d, i - 2)
  }
  p.x = x
  p.y = y
  return p
}

function getRange (v, min, max) {
  v = Math.max(v, min)
  v = Math.min(v, max)
  return v
}

function getLoop (v, min, max) {
  const d = max - min
  while (v > max) {
    v -= d
  }
  while (v < min) {
    v += d
  }
  return v
}

const aMCBAND = [12890594.86, 8362377.87, 5591021, 3481989.83, 1678043.12, 0]

const aLLBAND = [75, 60, 45, 30, 15, 0]

const aMC2LL = [
  [1.410526172116255e-8, 0.00000898305509648872, -1.9939833816331,
    200.9824383106796, -187.2403703815547, 91.6087516669843,
    -23.38765649603339, 2.57121317296198, -0.03801003308653,
    17337981.2],
  [-7.435856389565537e-9, 0.000008983055097726239, -0.78625201886289,
    96.32687599759846, -1.85204757529826, -59.36935905485877,
    47.40033549296737, -16.50741931063887, 2.28786674699375,
    10260144.86],
  [-3.030883460898826e-8, 0.00000898305509983578, 0.30071316287616,
    59.74293618442277, 7.357984074871, -25.38371002664745,
    13.45380521110908, -3.29883767235584, 0.32710905363475,
    6856817.37],
  [-1.981981304930552e-8, 0.000008983055099779535, 0.03278182852591,
    40.31678527705744, 0.65659298677277, -4.44255534477492,
    0.85341911805263, 0.12923347998204, -0.04625736007561,
    4482777.06],
  [3.09191371068437e-9, 0.000008983055096812155, 0.00006995724062,
    23.10934304144901, -0.00023663490511, -0.6321817810242,
    -0.00663494467273, 0.03430082397953, -0.00466043876332,
    2555164.4],
  [2.890871144776878e-9, 0.000008983055095805407, -3.068298e-8,
    7.47137025468032, -0.00000353937994, -0.02145144861037,
    -0.00001234426596, 0.00010322952773, -0.00000323890364,
    826088.5]
]

const aLL2MC = [
  [-0.0015702102444, 111320.7020616939, 1704480524535203,
    -10338987376042340, 26112667856603880, -35149669176653700,
    26595700718403920, -10725012454188240, 1800819912950474,
    82.5],
  [0.0008277824516172526, 111320.7020463578, 647795574.6671607,
    -4082003173.641316, 10774905663.51142, -15171875531.51559,
    12053065338.62167, -5124939663.577472, 913311935.9512032,
    67.5],
  [0.00337398766765, 111320.7020202162, 4481351.045890365,
    -23393751.19931662, 79682215.47186455, -115964993.2797253,
    97236711.15602145, -43661946.33752821, 8477230.501135234,
    52.5],
  [0.00220636496208, 111320.7020209128, 51751.86112841131,
    3796837.749470245, 992013.7397791013, -1221952.21711287,
    1340652.697009075, -620943.6990984312, 144416.9293806241,
    37.5],
  [-0.0003441963504368392, 111320.7020576856, 278.2353980772752,
    2485758.690035394, 6070.750963243378, 54821.18345352118,
    9540.606633304236, -2710.55326746645, 1405.483844121726,
    22.5],
  [-0.0003218135878613132, 111320.7020701615, 0.00369383431289,
    823725.6402795718, 0.46104986909093, 2351.343141331292,
    1.58060784298199, 8.77738589078284, 0.37238884252424,
    7.45]
]

export default {
  project: latlng => {
    const point = forward({x: latlng.lng, y: latlng.lat})
    return L.point(point.x, point.y)
  },

  unproject: point => {
    const latlng = inverse({x: point.x, y: point.y})
    return L.latLng(latlng.y, latlng.x)
  },

  bounds: (() => {
    const d = 33554432
    return L.bounds([-d, -d], [d, d])
  })()
}