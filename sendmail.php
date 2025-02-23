<?php
// define root to access global configs
require_once($_SERVER['DOCUMENT_ROOT'] . '/ipqs_config.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/lead_buyers.php');

//error_reporting(E_ERROR | E_PARSE);
header('Content-type: application/json');

// Set the default timezone to PST
date_default_timezone_set('America/New_York');

$thank_you_url = "https://legalclaimassistant.com/thank-you/?transaction_id=" . ($_POST['clickId'] ?? '') . "&bread=" . ($_POST['bread'] ?? '') . "&externalId=" . ($_POST['transaction_id'] ?? '');
function GetIP()
{
    foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key) {
        if (array_key_exists($key, $_SERVER) === true) {
            foreach (array_map('trim', explode(',', $_SERVER[$key])) as $ip) {
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                    return $ip;
                }
            }
        }
    }
}

$found_empty = false;

//All good, send the lead to excel
try{
    if(empty($_POST['honey'])){
        // validate all fields, make sure all fields are present
        $all_fields = [
            "first_name",
            "last_name",
            "phone",
            "email",
            "exposed",
            "attorney",
            "injury",
            "occasions_exposed",
            "occupation_exposed",
            "exposed_to_afff_in_military",
        ];

        foreach ($all_fields as $field) {
            if (empty($_POST[$field])) {
                $response_array = ['status' => 'error', 'message' => 'Please fill out all the information and try again!'];
                $found_empty = true;
            }
        }
        if (!$found_empty) {
            if(IPQS_PHONE_VALIDATION($_POST['phone'])['status'] == "invalid") {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Please enter a valid phone number'
                ]);
                exit();
            }

            // trusted form
            $tf_cert_id = '';
            $tf_cert_url = '';
            if (!empty($_POST['xxTrustedFormCertUrl'])) {
                //trusuted form
                $tf_cert_id = substr($_POST['xxTrustedFormCertUrl'], strrpos($_POST['xxTrustedFormCertUrl'], '/') + 1);
                $tf_cert_url =$_POST['xxTrustedFormCertUrl'];
            }

            // gmfo_lp_ping_id get from ping
            $ping_id = null;
            $url = "https://growmyfirmonline.leadspediatrack.com/ping.do";

            // custom mapping for converge buyer
            $generated_id = mt_rand(1000000, 9999999);

            $cd_data = [
                'questions' => [
                    [
                        'question' => [
                            'type' => 'rko',
                            'Were you exposed to firefighting foam (AFFF)?' => $_POST['exposed'] ?? 'Yes',
                        ]
                    ],
                    [
                        'question' => [
                            'type' => 'rko',
                            'Do you have a lawyer currently representing you on this case?' => $_POST['attorney'] ?? 'No',
                        ]
                    ],
                    [
                        'question' => [
                            'type' => 'rko',
                            'Were you or someone you know professionally diagnosed with any of the following within the last 20 years?' => $_POST['injury'] ?? 'None',
                        ]
                    ]
                ]
            ];

            $cd_data = json_encode($cd_data);

            //send to monetize
            $monetize_payload = [
                'source' => empty($_POST['affid']) ? "legalclaimassistant.com/organic" : 'legalclaimassistant.com/firefoam',
                'platform_name' => 'GrowMyFirmOnline - Fire Fighting Foam',
                'first_name' => $_POST['first_name'],
                'last_name' => $_POST['last_name'],
                'email' => $_POST['email'],
                'phone' => $_POST['phone'],
                'injury' => $_POST['injury'] ?? null,
                'occasions_exposed' => $_POST['occasions_exposed'] ?? null,
                'occupation_exposed' => $_POST['occupation_exposed'] ?? null,
                'exposed_duration' => $_POST['exposed_duration'] ?? null,
                'exposed_to_afff_in_military' => $_POST['exposed_to_afff_in_military'] ?? null,
                'attorney' => $_POST['attorney'] ?? null,
                'firefighting_foam' => $_POST['exposed'] ?? null,
                'ip_address' => GetIP(),
                'list_id' => $_POST['list_id'] ?? null,
                'clickId' => $_POST['clickId'] ?? null,
                'fb_click_id' => $_POST['fbclid'] ?? null,
                'affid' => $_POST['affid'] ?? null,
                'jornaya_leadid' => $_POST['universal_leadid'] ?? null,
                'transaction_id' => $_POST['transaction_id'] ?? null,
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                'device' => $_POST['device'] ?? null,
                'gmfo_lp_ping_id' => $ping_id ?? null,
                'zip_code' => $_POST['zip_code'] ?? null,
                'state' => $_POST['state'] ?? null,
                'city' => $_POST['city'] ?? null,
                'api_mode' => 'instant',
                'optin_date' => date('Y-m-d H:i:s'),
                'description' => $_POST['description'], 
                'page_source' => 'main', 
                'unique_id' => $generated_id,
                'dp_unique_id' => $generated_id,
                'cd_data' => $cd_data, 
                'proof' => $_POST['proof'] ?? null,
                'disclaimerText' => $_POST['disclaimerText'] ?? null,
                'lp_page_source' => 'https://legalclaimassistant.com/case-review/firefoam/main/',
            ];

            $monetize_payload['trusted_form_cert_id'] = $tf_cert_id;
            $monetize_payload['trusted_form_cert_url'] = $tf_cert_url;

            $monetize_payload = json_encode($monetize_payload);
            $mz_curl = curl_init();

            curl_setopt_array($mz_curl, array(
                CURLOPT_URL => 'https://monetize.affimedia.nl/api/v1/platform-datas/post',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => $monetize_payload,
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'platform-key: 5cTa1f47Pl3jfSiov'
                ],
            ));

            $mz_response = curl_exec($mz_curl);
            curl_close($mz_curl);

            //check who is the lead buyer
            $monetizeResArr = json_decode($mz_response, true);
            $lead_buyer = json_decode($mz_response, true)["conversions"][0] ?? null;

            // Get the current day and time in EST
            $currentDay = date('N'); // 1 (Monday) to 7 (Sunday)
            $currentHour = date('G'); // 0 to 23 (24-hour format)
            $callable = $currentDay >= 1 && $currentDay <= 5 && $currentHour >= 9 && $currentHour < 17;

            $qualified = ($_POST['exposed'] != "No" && $_POST['attorney'] !== "Yes" && $_POST['injury'] !== "None" ) ? true : false;

            $eligible = (!in_array($_POST['injury'], ['None']) &&  $_POST['attorney'] != 'Yes' &&  $_POST['exposed'] != 'No') ? true : false;

            if( (isset($monetizeResArr['buyers_type']) && in_array('CPL', $monetizeResArr['buyers_type']) ) || !$qualified) {
            // if( (!empty($lead_buyer) && in_array($lead_buyer, $cpl_buyers) ) || !$qualified ) {
                $thank_you_url = "https://legalclaimassistant.com/thank-you/crosscall/?clickId=" . ($_POST['clickId'] ?? '') . "&affid=" . ($_POST['affid'] ?? ($_POST['s1'] ?? '')) . "&list_id=" . ($_POST['list_id'] ?? '') . "&bread=" . ($_POST['bread'] ?? '') . "&externalId=" . ($_POST['transaction_id'] ?? '');
            } else {
                // Get the current day and time in EST
                $currentDay = date('N'); // 1 (Monday) to 7 (Sunday)
                $currentHour = date('G'); // 0 to 23 (24-hour format)
                $callable = $currentHour >= 9 && $currentHour < 17;

                $thank_you_url = "https://legalclaimassistant.com/thank-you-v3/?ph=8773293251&clickId=" . ($_POST['clickId'] ?? '') . "&affid=" . ($_POST['affid'] ?? ($_POST['s1'] ?? '')) . "&externalId=" . ($_POST['transaction_id'] ?? '') . "&list_id=" . ($_POST['list_id'] ?? '') . "&bread=" . ($_POST['bread'] ?? '');
            }
            echo json_encode([
                'status' => 'success',
                'url' => $thank_you_url
            ]);
            exit();
        }
    }
} catch (\Throwable $th) {}

echo json_encode([
    'status' => 'success',
    'url' => "https://legalclaimassistant.com/thank-you/"
]);
exit();