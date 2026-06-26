/**
 * 地图工具类 - WGS84/GCJ02坐标转换与距离计算
 */
export class MapUtil {
  private static readonly EARTH_RADIUS = 6371000 // 地球半径(米)

  /**
   * WGS84 转 GCJ02 (火星坐标系)
   */
  static wgs84ToGcj02(lng: number, lat: number): { longitude: number; latitude: number } {
    if (MapUtil._outOfChina(lng, lat)) {
      return { longitude: lng, latitude: lat }
    }

    let dLat = MapUtil._transformLat(lng - 105.0, lat - 35.0)
    let dLng = MapUtil._transformLng(lng - 105.0, lat - 35.0)
    const radLat = (lat / 180.0) * Math.PI
    let magic = Math.sin(radLat)
    magic = 1 - 0.00669342162296594323 * magic * magic
    const sqrtMagic = Math.sqrt(magic)
    dLat = (dLat * 180.0) / (((6378245.0 * (1 - 0.00669342162296594323)) / (magic * sqrtMagic)) * Math.PI)
    dLng = (dLng * 180.0) / ((6378245.0 / sqrtMagic) * Math.cos(radLat) * Math.PI)

    return {
      longitude: lng + dLng,
      latitude: lat + dLat
    }
  }

  /**
   * Haversine 公式计算两点间距离(米)
   */
  static calculateDistance(
    lat1: number, lng1: number,
    lat2: number, lng2: number
  ): number {
    const dLat = MapUtil._toRadians(lat2 - lat1)
    const dLng = MapUtil._toRadians(lng2 - lng1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(MapUtil._toRadians(lat1)) *
        Math.cos(MapUtil._toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return MapUtil.EARTH_RADIUS * c
  }

  /**
   * 格式化距离显示
   */
  static formatDistance(meters: number): string {
    if (meters < 1000) {
      return Math.round(meters) + 'm'
    }
    return (meters / 1000).toFixed(1) + 'km'
  }

  private static _toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180
  }

  private static _transformLat(x: number, y: number): number {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x))
    ret += ((20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0) / 3.0
    ret += ((20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin((y / 3.0) * Math.PI)) * 2.0) / 3.0
    ret += ((160.0 * Math.sin((y / 12.0) * Math.PI) + 320.0 * Math.sin((y * Math.PI) / 30.0)) * 2.0) / 3.0
    return ret
  }

  private static _transformLng(x: number, y: number): number {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x))
    ret += ((20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0) / 3.0
    ret += ((20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin((x / 3.0) * Math.PI)) * 2.0) / 3.0
    ret += ((150.0 * Math.sin((x / 12.0) * Math.PI) + 300.0 * Math.sin((x / 30.0) * Math.PI)) * 2.0) / 3.0
    return ret
  }

  private static _outOfChina(lng: number, lat: number): boolean {
    return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271
  }
}
