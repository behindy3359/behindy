// ID 타입
export type ID = number | string;

// 날짜 문자열
export type DateString = string;

// 옵셔널 필드 제외
export type WithoutOptional<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// 부분 업데이트용
export type PartialUpdate<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

// 응답에서 메타데이터 제외
export type EntityData<T> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'>;

// 선택적 필터
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
