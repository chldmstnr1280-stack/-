/**
 * Health Service
 * 플랫폼 독립적인 건강 데이터 서비스
 */

import { Platform } from 'react-native';
import AppleHealthService, { HealthData, HealthPermissions } from './appleHealth';
import GoogleFitService from './googleFit';

class HealthService {
  /**
   * 현재 플랫폼의 건강 서비스 가져오기
   */
  private getService() {
    return Platform.OS === 'ios' ? AppleHealthService : GoogleFitService;
  }

  /**
   * 건강 데이터 사용 가능 여부 확인
   */
  async isAvailable(): Promise<boolean> {
    const service = this.getService();
    if (Platform.OS === 'ios') {
      return service.isHealthDataAvailable();
    } else {
      return service.isFitDataAvailable();
    }
  }

  /**
   * 권한 요청
   */
  async requestPermissions(): Promise<HealthPermissions> {
    const service = this.getService();
    return service.requestPermissions();
  }

  /**
   * 오늘의 건강 데이터 가져오기
   */
  async getTodayData(): Promise<HealthData> {
    const service = this.getService();
    return service.getTodayHealthData();
  }

  /**
   * 걸음 수만 가져오기
   */
  async getSteps(): Promise<number> {
    const service = this.getService();
    return service.getStepsToday();
  }

  /**
   * 수면 시간만 가져오기
   */
  async getSleep(): Promise<number> {
    const service = this.getService();
    return service.getSleepLastNight();
  }

  /**
   * 플랫폼 이름 가져오기 (UI 표시용)
   */
  getPlatformName(): string {
    return Platform.OS === 'ios' ? 'Apple Health' : 'Google Fit';
  }
}

export default new HealthService();
