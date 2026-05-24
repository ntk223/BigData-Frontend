# PredictCare AI - API Documentation

Tài liệu cung cấp đặc tả chi tiết về các endpoint, cấu trúc request body (236 đặc trưng lâm sàng) và các response tương ứng của hệ thống Hỗ trợ Ra quyết định Lâm sàng (CDSS) PredictCare AI.

## 📌 Các Địa Chỉ URL Cơ Bản
*   **Base URL (Chạy cục bộ):** `http://127.0.0.1:8000`
*   **Swagger UI (Xem trực quan & test):** `http://127.0.0.1:8000/docs`

---

## 🔑 1. Các Endpoint Chung & Lấy Mẫu Dữ Liệu

### 1.1 Kiểm tra trạng thái hệ thống
*   **Method:** `GET`
*   **Endpoint:** `/`
*   **Mô tả:** Trả về trạng thái hoạt động và danh sách các endpoint khả dụng.
*   **Response (JSON):**
    ```json
    {
      "status": "online",
      "project": "PREDICTCARE AI - CDSS Dashboard (Team 10)",
      "tasks": [
        "30-day Readmission Risk Prediction",
        "12-month Mortality Risk Prediction"
      ],
      "endpoints": {
        "swagger_docs": "/docs",
        "metadata": "/metadata",
        "sample_request": "/sample",
        "predict_readmission": "/predict/readmission",
        "what_if_readmission": "/what-if/readmission",
        "predict_mortality": "/predict/mortality",
        "what_if_mortality": "/what-if/mortality"
      }
    }
    ```

### 1.2 Lấy Payload mẫu (236 đặc trưng lâm sàng)
*   **Method:** `GET`
*   **Endpoint:** `/sample`
*   **Mô tả:** Trả về một đối tượng JSON đầy đủ chứa 236 đặc trưng lâm sàng đã được điền sẵn giá trị mặc định hợp lệ. **Sử dụng endpoint này làm mẫu gửi Request Body cho các API dự báo phía dưới.**
*   **Response (JSON rút gọn):**
    ```json
    {
      "age": 75.0,
      "gender": "M",
      "discharge_location": "HOME",
      "duration_days": 4.0,
      "sbp_mean": 120.0,
      "spo2_mean": 97.5,
      "hr_mean": 80.0,
      "temperature_mean": 37.0,
      "bun_mean": 30.0,
      "pt_min": 12.0,
      "...": 0.0, 
      "note_emb_0": 0.01,
      "note_emb_223": 0.01
    }
    ```

---

## 📈 2. Các Endpoint Dự Báo Tái Nhập Viện (30-day Readmission)

Tất cả các endpoint POST sử dụng chung một cấu trúc Request Body chứa 236 tham số lâm sàng (Lấy từ `/sample`).

### 2.1 Dự báo xác suất tái nhập viện trong 30 ngày
*   **Method:** `POST`
*   **Endpoint:** `/predict/readmission`
*   **Request Body:** Đối tượng JSON 236 tham số lâm sàng (Lấy từ `/sample`).
*   **Response (JSON):**
    *   `prediction`: Dự báo nhị phân (`0`: Không tái nhập viện, `1`: Có tái nhập viện).
    *   `confidence`: Độ tin cậy của dự báo (từ 0.0 đến 1.0).
    *   `readmission_probability`: Xác suất bệnh nhân tái nhập viện trong 30 ngày.
    *   `curve_30day`: Đường tích lũy rủi ro tăng dần theo thời gian từ ngày 0 đến ngày 30.
    ```json
    {
      "status": "success",
      "data": {
        "prediction": 0,
        "confidence": 0.7446242272853851,
        "readmission_probability": 0.25537577271461487,
        "curve_30day": {
          "days": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
          "probabilities": [
            0.0,
            0.021593104715598766,
            0.041526052647806316,
            0.05992648271570079,
            0.07691222049191836,
            0.09259203268858178,
            0.10706632363559433,
            0.1204277782111377,
            0.13276195534132432,
            0.14414783586942773,
            0.15465832830292536,
            0.16436073567686005,
            0.17331718652304134,
            0.18158503270475979,
            0.18921721666451435,
            0.1962626104363937,
            0.2027663285939461,
            0.20877001713747437,
            0.2143121201706194,
            0.21942812607387457,
            0.22415079475137997,
            0.22851036740615335,
            0.2325347601870348,
            0.23624974294734688,
            0.23967910425993547,
            0.2428448037452519,
            0.2457671126878953,
            0.2484647438420413,
            0.2509549712569553,
            0.2532537408898825,
            0.25537577271461487
          ]
        }
      }
    }
    ```

### 2.2 Giả lập What-If tác động xuất viện đến Tái Nhập Viện
*   **Method:** `POST`
*   **Endpoint:** `/what-if/readmission`
*   **Request Body:** Đối tượng JSON 236 tham số lâm sàng (Lấy từ `/sample`).
*   **Mô tả:** Tự động ghi đè cột `discharge_location` thành 3 kịch bản: `HOME` (Về nhà tự chăm sóc), `HOME HEALTH CARE` (Có y tá hỗ trợ tại nhà) và `SKILLED NURSING FACILITY` (Vào viện dưỡng lão) để so sánh xác suất tái nhập viện của từng phương án.
*   **Response (JSON):**
    ```json
    {
      "status": "success",
      "data": {
        "HOME": {
          "name": "Về nhà (HOME) - Tự chăm sóc",
          "code": 5,
          "readmission_probability": 0.25537577271461487,
          "curve_30day": {
            "days": [0, 1, 2, ..., 30],
            "probabilities": [0.0, 0.021593, ..., 0.255376]
          }
        },
        "HOME HEALTH CARE": {
          "name": "HOME HEALTH CARE - Có điều dưỡng hỗ trợ",
          "code": 6,
          "readmission_probability": 0.27926209568977356,
          "curve_30day": {
            "days": [0, 1, 2, ..., 30],
            "probabilities": [0.0, 0.023612, ..., 0.279262]
          }
        },
        "SKILLED NURSING FACILITY": {
          "name": "VIỆN ĐIỀU DƯỠNG (SNF) - Chăm sóc 24/7",
          "code": 11,
          "readmission_probability": 0.2753971219062805,
          "curve_30day": {
            "days": [0, 1, 2, ..., 30],
            "probabilities": [0.0, 0.023285, ..., 0.275397]
          }
        }
      }
    }
    ```

---

## ☠️ 3. Các Endpoint Dự Báo Tử Vong 12 Tháng (12-month Mortality)

Tất cả các endpoint POST sử dụng chung một cấu trúc Request Body chứa 236 tham số lâm sàng (Lấy từ `/sample`).

### 3.1 Dự báo rủi ro tử vong và thời gian sống sót tích lũy (RMST)
*   **Method:** `POST`
*   **Endpoint:** `/predict/mortality`
*   **Request Body:** Đối tượng JSON 236 tham số lâm sàng (Lấy từ `/sample`).
*   **Response (JSON):**
    *   `mortality_risk_12m`: Xác suất tử vong trong vòng 12 tháng kế tiếp (1 - S(365)).
    *   `rmst_12m`: Số ngày sống khỏe tích lũy dự kiến trong 1 năm kế tiếp (tối đa 365 ngày).
    *   `survival_curve`: Đường đồ thị chỉ ra xác suất sống sót giảm dần từ ngày 0 đến ngày 365.
    ```json
    {
      "status": "success",
      "data": {
        "mortality_risk_12m": 0.07793326373226939,
        "rmst_12m": 351.2069872133447,
        "survival_curve": {
          "days": [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 365],
          "probabilities": [
            1.0,
            0.9947134307400495,
            0.9887651376529679,
            0.9825627280590306,
            0.9762045334436363,
            0.9697396492502972,
            0.9631980789419647,
            0.9566002462214603,
            0.9499610319206564,
            0.9432917990289518,
            0.9366015269412931,
            0.9298974990059197,
            0.9231857449422011,
            0.9220667362677306
          ]
        }
      }
    }
    ```

### 3.2 Giả lập What-If tác động xuất viện đến Rủi Ro Tử Vong 12 Tháng
*   **Method:** `POST`
*   **Endpoint:** `/what-if/mortality`
*   **Request Body:** Đối tượng JSON 236 đặc trưng lâm sàng (Lấy từ `/sample`).
*   **Mô tả:** Tự động mô phỏng thay đổi quyết định xuất viện của bệnh nhân sang các kịch bản: `HOME` (mã số 5), `HOME HEALTH CARE` (mã số 6), `SKILLED NURSING FACILITY` (mã số 12) để xem trước thay đổi về rủi ro tử vong 12 tháng, RMST và đường cong sống sót S(t).
*   **Response (JSON):**
    ```json
    {
      "status": "success",
      "data": {
        "HOME": {
          "name": "Về nhà (HOME) - Tự chăm sóc",
          "code": 5,
          "mortality_risk_12m": 0.07793326373226939,
          "rmst_12m": 351.2069872133447,
          "survival_curve": {
            "days": [0, 30, 60, ..., 365],
            "probabilities": [1.0, 0.994713, ..., 0.922067]
          }
        },
        "HOME HEALTH CARE": {
          "name": "HOME HEALTH CARE - Có điều dưỡng hỗ trợ",
          "code": 6,
          "mortality_risk_12m": 0.08170565073621294,
          "rmst_12m": 350.4827345248673,
          "survival_curve": {
            "days": [0, 30, 60, ..., 365],
            "probabilities": [1.0, 0.994351, ..., 0.918294]
          }
        },
        "SKILLED NURSING FACILITY": {
          "name": "VIỆN ĐIỀU DƯỠNG (SNF) - Chăm sóc 24/7",
          "code": 12,
          "mortality_risk_12m": 0.11920435356459225,
          "rmst_12m": 343.09287129874684,
          "survival_curve": {
            "days": [0, 30, 60, ..., 365],
            "probabilities": [1.0, 0.990333, ..., 0.880796]
          }
        }
      }
    }
    ```
