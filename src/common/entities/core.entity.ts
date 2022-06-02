import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class CoreEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
// @CreateDateColumn은 엔터티의 삽입 날짜로 자동 설정되는 특수 열입니다.
// @UpdateDateColumn은 entity manager 또는 repository의 저장을 호출할 때마다 
// 엔티티의 업데이트 시간으로 자동 설정되는 특수 컬럼