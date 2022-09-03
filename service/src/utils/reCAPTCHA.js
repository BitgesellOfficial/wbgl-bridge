import fetch from 'node-fetch';

import { reCAPCHTA } from './config'

export default async function validateCaptchaToken(captchaToken) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  };

  const captchaValidationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${reCAPCHTA.siteKey}&response=${captchaToken}`;

  try {
    const response = await fetch(captchaValidationUrl, { headers, method: "POST" });
    const captchaValidation = await response.json()
    return captchaValidation.success
  } catch (error) {
    console.info(`Failed to validatevc captchaToken with`, error)
    throw new Error(error?.message)
  }
}