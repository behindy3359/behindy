# EC2 모니터링 및 알람 설정 가이드

> EC2 메모리/디스크 사용량을 모니터링하고 이메일 알람을 받는 방법

**작성일**: 2025-01-23
**대상**: AWS EC2 (behindy 프로젝트)

---

## 개요

AWS EC2는 기본적으로 CPU, 네트워크만 모니터링합니다.
**메모리와 디스크 사용량**을 모니터링하려면 CloudWatch Agent를 설치해야 합니다.

### 알람 시나리오
- 📧 **메모리 사용량 85% 초과** → 이메일 알람
- 📧 **디스크 사용량 80% 초과** → 이메일 알람
- 📧 **디스크 사용량 90% 초과** → 긴급 알람

---

## 1단계: CloudWatch Agent 설치

### 1.1 EC2에 SSH 접속

```bash
ssh -i ~/.ssh/your-key.pem ubuntu@your-ec2-ip
```

### 1.2 CloudWatch Agent 다운로드 및 설치

```bash
# 패키지 업데이트
sudo apt-get update

# CloudWatch Agent 다운로드
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb

# 설치
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# 설치 확인
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a query -m ec2 -c default -s
```

### 1.3 IAM Role 확인

EC2 인스턴스에 CloudWatch 권한이 있는 IAM Role이 연결되어 있어야 합니다.

**필요한 권한**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:PutMetricData",
        "ec2:DescribeVolumes",
        "ec2:DescribeTags",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams",
        "logs:DescribeLogGroups",
        "logs:CreateLogStream",
        "logs:CreateLogGroup"
      ],
      "Resource": "*"
    }
  ]
}
```

**IAM Role 연결 방법**:
1. AWS Console → EC2 → Instances
2. 인스턴스 선택 → Actions → Security → Modify IAM role
3. `CloudWatchAgentServerRole` 선택 (없으면 생성)

---

## 2단계: CloudWatch Agent 설정

### 2.1 설정 파일 생성

```bash
sudo mkdir -p /opt/aws/amazon-cloudwatch-agent/etc/

sudo nano /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
```

### 2.2 설정 내용 입력

```json
{
  "agent": {
    "metrics_collection_interval": 60,
    "run_as_user": "root"
  },
  "metrics": {
    "namespace": "Behindy/EC2",
    "metrics_collected": {
      "mem": {
        "measurement": [
          {
            "name": "mem_used_percent",
            "rename": "MemoryUsedPercent",
            "unit": "Percent"
          }
        ],
        "metrics_collection_interval": 60
      },
      "disk": {
        "measurement": [
          {
            "name": "used_percent",
            "rename": "DiskUsedPercent",
            "unit": "Percent"
          }
        ],
        "metrics_collection_interval": 60,
        "resources": [
          "*"
        ]
      },
      "diskio": {
        "measurement": [
          {
            "name": "io_time",
            "rename": "DiskIOTime",
            "unit": "Milliseconds"
          }
        ],
        "metrics_collection_interval": 60
      }
    }
  }
}
```

### 2.3 CloudWatch Agent 시작

```bash
# Agent 시작
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -s \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json

# 상태 확인
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a query -m ec2 -c default -s

# 자동 시작 설정
sudo systemctl enable amazon-cloudwatch-agent
sudo systemctl status amazon-cloudwatch-agent
```

**성공 시 출력**:
```
{
  "status": "running",
  "starttime": "2025-01-23T16:00:00",
  "configstatus": "configured",
  "version": "1.x.x"
}
```

---

## 3단계: SNS Topic 생성 (이메일 알람용)

### 3.1 SNS Topic 생성

```bash
# AWS CLI 사용
aws sns create-topic --name behindy-ec2-alerts --region ap-northeast-2

# 출력된 TopicArn 복사
# arn:aws:sns:ap-northeast-2:123456789012:behindy-ec2-alerts
```

### 3.2 이메일 구독 추가

```bash
# 이메일 주소를 실제 이메일로 변경
aws sns subscribe \
  --topic-arn arn:aws:sns:ap-northeast-2:123456789012:behindy-ec2-alerts \
  --protocol email \
  --notification-endpoint your-email@example.com \
  --region ap-northeast-2
```

### 3.3 이메일 확인

AWS에서 확인 이메일이 전송됩니다.
**"Confirm subscription"** 링크를 클릭하세요.

---

## 4단계: CloudWatch Alarms 생성

### 4.1 메모리 사용량 알람 (85% 초과)

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "behindy-high-memory-usage" \
  --alarm-description "Memory usage exceeded 85%" \
  --metric-name MemoryUsedPercent \
  --namespace Behindy/EC2 \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 85 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:ap-northeast-2:123456789012:behindy-ec2-alerts \
  --region ap-northeast-2
```

### 4.2 디스크 사용량 알람 (80% 초과)

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "behindy-high-disk-usage" \
  --alarm-description "Disk usage exceeded 80%" \
  --metric-name DiskUsedPercent \
  --namespace Behindy/EC2 \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:ap-northeast-2:123456789012:behindy-ec2-alerts \
  --region ap-northeast-2
```

### 4.3 디스크 사용량 긴급 알람 (90% 초과)

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "behindy-critical-disk-usage" \
  --alarm-description "CRITICAL: Disk usage exceeded 90%" \
  --metric-name DiskUsedPercent \
  --namespace Behindy/EC2 \
  --statistic Average \
  --period 300 \
  --evaluation-periods 1 \
  --threshold 90 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:ap-northeast-2:123456789012:behindy-ec2-alerts \
  --region ap-northeast-2
```

### 4.4 CPU 사용량 알람 (90% 초과) - 보너스

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "behindy-high-cpu-usage" \
  --alarm-description "CPU usage exceeded 90%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --dimensions Name=InstanceId,Value=i-xxxxxxxxx \
  --statistic Average \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 90 \
  --comparison-operator GreaterThanThreshold \
  --alarm-actions arn:aws:sns:ap-northeast-2:123456789012:behindy-ec2-alerts \
  --region ap-northeast-2
```

**주의**: `i-xxxxxxxxx`를 실제 EC2 인스턴스 ID로 변경하세요.

---

## 5단계: 모니터링 확인

### 5.1 CloudWatch 콘솔에서 확인

1. AWS Console → CloudWatch
2. **Metrics** → **Behindy/EC2**
3. MemoryUsedPercent, DiskUsedPercent 그래프 확인

### 5.2 알람 상태 확인

```bash
aws cloudwatch describe-alarms \
  --alarm-names \
    "behindy-high-memory-usage" \
    "behindy-high-disk-usage" \
    "behindy-critical-disk-usage" \
  --region ap-northeast-2
```

### 5.3 현재 메모리/디스크 사용량 확인 (EC2에서)

```bash
# 메모리 사용량
free -h

# 디스크 사용량
df -h

# 상세 디스크 분석
du -h --max-depth=1 / | sort -hr | head -20
```

---

## 6단계: 디스크 공간 정리 (필요 시)

### 6.1 Docker 정리

```bash
# 사용하지 않는 이미지 삭제
docker image prune -a

# 사용하지 않는 볼륨 삭제 (주의: 데이터 손실 가능)
docker volume prune

# 빌드 캐시 삭제
docker builder prune -a

# 전체 정리 (주의!)
docker system prune -a --volumes
```

### 6.2 로그 파일 정리

```bash
# 오래된 로그 삭제 (30일 이상)
sudo find /var/log -type f -name "*.log" -mtime +30 -delete

# journal 로그 제한 (100MB로 제한)
sudo journalctl --vacuum-size=100M
```

### 6.3 APT 캐시 정리

```bash
sudo apt-get clean
sudo apt-get autoremove -y
```

---

## 알람 테스트

### 메모리 알람 테스트

```bash
# 메모리를 강제로 사용 (테스트용)
stress --vm 1 --vm-bytes 1500M --timeout 60s

# 설치되지 않았다면
sudo apt-get install stress
```

### 디스크 알람 테스트

```bash
# 임시 파일 생성 (1GB)
dd if=/dev/zero of=/tmp/testfile bs=1M count=1000

# 확인 후 삭제
rm /tmp/testfile
```

5-10분 후 이메일이 도착해야 합니다.

---

## 비용 안내

### CloudWatch 비용

- **메트릭**: 처음 10개 무료, 이후 $0.30/메트릭/월
- **알람**: 처음 10개 무료, 이후 $0.10/알람/월
- **현재 설정**: 3개 메트릭 + 4개 알람 = **무료**

### 예상 월 비용

```
메트릭 3개 (무료)           $0.00
알람 4개 (무료)             $0.00
SNS 이메일 (1000건 무료)   $0.00
━━━━━━━━━━━━━━━━━━━━━━━━━━━
총 비용                    $0.00
```

---

## 문제 해결

### CloudWatch Agent가 시작되지 않을 때

```bash
# 로그 확인
sudo tail -f /opt/aws/amazon-cloudwatch-agent/logs/amazon-cloudwatch-agent.log

# 재시작
sudo systemctl restart amazon-cloudwatch-agent

# 설정 파일 검증
cat /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json | jq .
```

### 메트릭이 보이지 않을 때

1. **IAM Role 확인**: EC2에 CloudWatchAgentServerRole이 연결되어 있는지
2. **Agent 상태 확인**: `systemctl status amazon-cloudwatch-agent`
3. **네트워크 확인**: Security Group에서 아웃바운드 HTTPS(443) 허용
4. **Region 확인**: EC2와 CloudWatch가 같은 리전인지

### 이메일이 오지 않을 때

1. **SNS 구독 확인**: "Confirmed" 상태인지 확인
2. **스팸 폴더 확인**: AWS 이메일이 스팸으로 분류될 수 있음
3. **알람 상태 확인**: CloudWatch 콘솔에서 알람이 "In alarm" 상태인지

---

## 자동화 스크립트

전체 과정을 자동화한 스크립트입니다.

### setup-monitoring.sh

```bash
#!/bin/bash

# 변수 설정
TOPIC_NAME="behindy-ec2-alerts"
EMAIL="your-email@example.com"
REGION="ap-northeast-2"
INSTANCE_ID=$(ec2-metadata --instance-id | cut -d " " -f 2)

echo "🚀 Behindy EC2 모니터링 설정 시작"

# 1. CloudWatch Agent 설치
echo "📦 CloudWatch Agent 설치 중..."
wget -q https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb
rm amazon-cloudwatch-agent.deb

# 2. 설정 파일 생성
echo "⚙️  설정 파일 생성 중..."
sudo mkdir -p /opt/aws/amazon-cloudwatch-agent/etc/
sudo tee /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json > /dev/null <<EOF
{
  "agent": {
    "metrics_collection_interval": 60,
    "run_as_user": "root"
  },
  "metrics": {
    "namespace": "Behindy/EC2",
    "metrics_collected": {
      "mem": {
        "measurement": [{"name": "mem_used_percent", "rename": "MemoryUsedPercent", "unit": "Percent"}],
        "metrics_collection_interval": 60
      },
      "disk": {
        "measurement": [{"name": "used_percent", "rename": "DiskUsedPercent", "unit": "Percent"}],
        "metrics_collection_interval": 60,
        "resources": ["*"]
      }
    }
  }
}
EOF

# 3. Agent 시작
echo "▶️  CloudWatch Agent 시작 중..."
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config -m ec2 -s \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json

# 4. SNS Topic 생성 (로컬에서 실행)
echo "📧 SNS Topic 생성 (로컬 PC에서 실행하세요):"
echo "aws sns create-topic --name $TOPIC_NAME --region $REGION"
echo "aws sns subscribe --topic-arn <TOPIC_ARN> --protocol email --notification-endpoint $EMAIL --region $REGION"

echo "✅ 모니터링 설정 완료!"
```

**사용법**:

```bash
# EC2에서 실행
chmod +x setup-monitoring.sh
./setup-monitoring.sh

# 로컬 PC에서 SNS 설정 (AWS CLI 필요)
aws sns create-topic --name behindy-ec2-alerts --region ap-northeast-2
aws sns subscribe --topic-arn <ARN> --protocol email --notification-endpoint your-email@example.com
```

---

## 대시보드 생성 (선택)

CloudWatch 대시보드로 한눈에 모니터링:

```bash
aws cloudwatch put-dashboard \
  --dashboard-name behindy-monitoring \
  --dashboard-body file://dashboard.json \
  --region ap-northeast-2
```

**dashboard.json**:
```json
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          ["Behindy/EC2", "MemoryUsedPercent"],
          [".", "DiskUsedPercent"]
        ],
        "period": 300,
        "stat": "Average",
        "region": "ap-northeast-2",
        "title": "Memory & Disk Usage"
      }
    }
  ]
}
```

---

## 참고 자료

- [CloudWatch Agent 설치 가이드](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Install-CloudWatch-Agent.html)
- [CloudWatch Alarms 생성](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html)
- [SNS 이메일 알람](https://docs.aws.amazon.com/sns/latest/dg/sns-email-notifications.html)

---

**최종 업데이트**: 2025-01-23
