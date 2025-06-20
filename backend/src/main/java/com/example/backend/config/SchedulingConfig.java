package com.example.backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;

@Slf4j
@Configuration
@EnableScheduling
public class SchedulingConfig implements SchedulingConfigurer {

    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();

        // 스레드풀 설정
        scheduler.setPoolSize(5); // 동시 실행 가능한 스케줄 작업 수
        scheduler.setThreadNamePrefix("metro-scheduler-");
        scheduler.setAwaitTerminationSeconds(30);
        scheduler.setWaitForTasksToCompleteOnShutdown(true);

        // 예외 처리 핸들러
        scheduler.setErrorHandler(throwable -> {
            log.error("스케줄 작업 실행 중 오류 발생: {}", throwable.getMessage(), throwable);
        });

        scheduler.initialize();
        taskRegistrar.setScheduler(scheduler);

        log.info("지하철 데이터 스케줄러 초기화 완료: 스레드풀 크기 {}", scheduler.getPoolSize());
    }
}