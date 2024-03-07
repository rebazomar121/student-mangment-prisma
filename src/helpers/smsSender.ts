import axios from "axios"

// for sms sender we will user infoBib API you can user you own API or set infoBib required here

/**
 * Builds the SMS API URL using the specified domain.
 *
 * @param {string} domain - The domain for the SMS API.
 * @returns {string} The constructed URL.
 */
const buildUrl = (domain) => {
  return `https://${domain}/sms/2/text/advanced`
}

/**
 * Builds the headers for making the API request.
 *
 * @param {string} apiKey - The API key for authorization.
 * @returns {Object} The headers object.
 */
const buildHeaders = (apiKey) => {
  return {
    "Content-Type": "application/json",
    Authorization: `App ${apiKey}`,
  }
}

/**
 * Builds the request body for sending an SMS.
 *
 * @param {string} destinationNumber - The phone number of the destination.
 * @param {string} message - The SMS message.
 * @param {string} companyName - The name of the company sending the SMS.
 * @returns {Object} The request body object.
 */
const buildRequestBody = (destinationNumber, message, companyName) => {
  const destinationObject = {
    to: destinationNumber,
  }
  const messageObject = {
    from: companyName,
    destinations: [destinationObject],
    text: message,
  }
  return {
    messages: [messageObject],
  }
}

/**
 * Parses a successful response from the SMS API.
 *
 * @param {Object} axiosResponse - The response from the Axios request.
 * @returns {Object} An object with success, messageId, status, and category properties.
 */
const parseSuccessResponse = (axiosResponse) => {
  const responseBody = axiosResponse.data
  const singleMessageResponse = responseBody.messages[0]
  return {
    success: true,
    messageId: singleMessageResponse.messageId,
    status: singleMessageResponse.status.name,
    category: singleMessageResponse.status.groupName,
  }
}

/**
 * Parses a failed response from the SMS API.
 *
 * @param {Object} axiosError - The error object from a failed Axios request.
 * @returns {Object} An object with success, errorMessage, and errorDetails properties.
 */
const parseFailedResponse = (axiosError) => {
  if (axiosError.response) {
    const responseBody = axiosError.response.data
    return {
      success: false,
      errorMessage: responseBody.requestError.serviceException.text,
      errorDetails: responseBody,
    }
  }
  return {
    success: false,
    errorMessage: axiosError.message,
  }
}

/**
 * Validates that a value is not empty. Throws an error if it is empty.
 *
 * @param {any} value - The value to validate.
 * @param {string} fieldName - The name of the field being validated.
 */
const validateNotEmpty = (value, fieldName) => {
  if (!value) {
    throw `${fieldName} parameter is mandatory`
  }
}

/**
 * Builds the Axios configuration object for making the API request.
 *
 * @param {string} apiKey - The API key for authorization.
 * @returns {Object} The Axios configuration object.
 */
const buildAxiosConfig = (apiKey) => {
  return {
    headers: buildHeaders(apiKey),
  }
}

/**
 * Sends an SMS using the provided configuration and message details.
 *
 * @param {Object} config - The configuration object containing domain and apiKey.
 * @param {string} destinationNumber - The phone number of the destination.
 * @param {string} message - The SMS message.
 * @param {string} companyName - The name of the company sending the SMS.
 * @returns {Promise<Object>} A Promise that resolves with the result of the SMS sending operation.
 */
const sendSms = (config, destinationNumber, message, companyName) => {
  validateNotEmpty(config.domain, "config.domain")
  validateNotEmpty(config.apiKey, "config.apiKey")
  validateNotEmpty(destinationNumber, "destinationNumber")
  validateNotEmpty(message, "message")

  const url = buildUrl(config.domain)
  const requestBody = buildRequestBody(destinationNumber, message, companyName)
  const axiosConfig = buildAxiosConfig(config.apiKey)

  return axios
    .post(url, requestBody, axiosConfig)
    .then((res) => parseSuccessResponse(res))
    .catch((err) => parseFailedResponse(err))
}

/**
 * Exported SMS_SENDER object with the sendSms function.
 */
export const SMS_SENDER = {
  sendSms,
}
