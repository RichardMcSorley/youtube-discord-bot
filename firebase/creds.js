module.exports = {
    "type": process.env.F_type,
    "project_id": process.env.F_project_id,
    "private_key_id": process.env.F_private_key_id,
    "private_key": Buffer.from(process.env.F_private_key, 'base64').toString(),
    "client_email": process.env.F_client_email,
    "client_id": process.env.F_client_id,
    "auth_uri": process.env.F_auth_uri,
    "token_uri": process.env.F_token_uri,
    "auth_provider_x509_cert_url": process.env.F_auth_provider_x509_cert_url,
    "client_x509_cert_url": process.env.F_client_x509_cert_url
};