
export interface DocDetail {
    name: string;
    value: string;
}

export interface DocImage {
    url: string;
}

export interface GeneralInfo {
    DocDetails: DocDetail[];
    DocImages: DocImage[];
}

export interface ReasonList {
    state: boolean;
    _id: string;
    reason: string;
    code: string;
}

export interface KYCData {
    app_key: string;
    eKycId: string;
    country_iso: string;
    is_verified: boolean;
    email: string;
    phone: string;
    BasicInfo: GeneralInfo;
    IdentityInfo: GeneralInfo;
    AddressInfo: GeneralInfo;
    FaceInfo: GeneralInfo;
    reasonList: ReasonList[];
    verification_comment : string
}

// export interface KYCData {
//     kycData: KycData;
// }

// export interface KYCData {
//     app_key: string;
//     eKycId: string;
//     country_iso: string;
//     is_verified: boolean;
//     email: string;
//     phone: string;
//     BasicInfo: GeneralInfo;
//     IdentityInfo: GeneralInfo;
//     AddressInfo: GeneralInfo;
//     FaceInfo: GeneralInfo;
//     reasonList: ReasonList[];
// }

// export interface KYCData {
//     kycData: KycData;
// }



