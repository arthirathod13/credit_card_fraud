// =====================================================
// THRESHOLD SLIDER
// =====================================================

const thresholdSlider =
    document.getElementById("threshold");

const thresholdValue =
    document.getElementById("threshold_value");


thresholdSlider.addEventListener(
    "input",
    function () {

        thresholdValue.textContent =
            this.value + "%";

    }
);


// =====================================================
// FRAUD PREDICTION
// =====================================================

async function predictFraud() {


    // -------------------------------------------------
    // GET VALUES FROM HTML
    // -------------------------------------------------

    const amount =
        document.getElementById("amount").value;

    const transactionHour =
        document.getElementById(
            "transaction_hour"
        ).value;

    const merchantCategory =
        document.getElementById(
            "merchant_category"
        ).value;

    const foreignTransaction =
        document.getElementById(
            "foreign_transaction"
        ).value;

    const locationMismatch =
        document.getElementById(
            "location_mismatch"
        ).value;

    const deviceTrustScore =
        document.getElementById(
            "device_trust_score"
        ).value;

    const velocityLast24h =
        document.getElementById(
            "velocity_last_24h"
        ).value;

    const cardholderAge =
        document.getElementById(
            "cardholder_age"
        ).value;

    const threshold =
        document.getElementById(
            "threshold"
        ).value;


    // -------------------------------------------------
    // CHECK INPUTS
    // -------------------------------------------------

    if (
        amount === "" ||
        transactionHour === "" ||
        merchantCategory === "" ||
        deviceTrustScore === "" ||
        velocityLast24h === "" ||
        cardholderAge === ""
    ) {

        alert(
            "Please fill all transaction details."
        );

        return;

    }


    // -------------------------------------------------
    // SHOW LOADING
    // -------------------------------------------------

    document
        .getElementById("loading")
        .classList
        .remove("hidden");


    document
        .getElementById("result")
        .classList
        .add("hidden");


    // -------------------------------------------------
    // CREATE DATA TO SEND TO FASTAPI
    // -------------------------------------------------

    const data = {

        amount:
            parseFloat(amount),

        transaction_hour:
            parseInt(transactionHour),

        merchant_category:
            merchantCategory,

        foreign_transaction:
            parseInt(foreignTransaction),

        location_mismatch:
            parseInt(locationMismatch),

        device_trust_score:
            parseInt(deviceTrustScore),

        velocity_last_24h:
            parseInt(velocityLast24h),

        cardholder_age:
            parseInt(cardholderAge),

        threshold:
            parseFloat(threshold) / 100

    };


    try {


        // -------------------------------------------------
        // SEND DATA TO FASTAPI
        // -------------------------------------------------

        const response =
            await fetch(
                "/predict",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)

                }
            );


        // -------------------------------------------------
        // GET RESPONSE
        // -------------------------------------------------

        const result =
            await response.json();


        // -------------------------------------------------
        // HIDE LOADING
        // -------------------------------------------------

        document
            .getElementById("loading")
            .classList
            .add("hidden");


        // -------------------------------------------------
        // SHOW RESULT
        // -------------------------------------------------

        document
            .getElementById("result")
            .classList
            .remove("hidden");


        document
            .getElementById(
                "fraud_probability"
            )
            .textContent =
                result.fraud_probability + "%";


        document
            .getElementById(
                "prediction_result"
            )
            .textContent =
                result.result;


        document
            .getElementById(
                "threshold_result"
            )
            .textContent =
                result.threshold + "%";


        // -------------------------------------------------
        // CHANGE RESULT TEXT
        // -------------------------------------------------

        const predictionElement =
            document.getElementById(
                "prediction_result"
            );


        if (result.prediction === 1) {

            predictionElement.style.color =
                "#dc2626";

        } else {

            predictionElement.style.color =
                "#16a34a";

        }


    }

    catch (error) {

        console.error(error);


        document
            .getElementById("loading")
            .classList
            .add("hidden");


        alert(
            "Something went wrong while connecting to the server."
        );

    }

}