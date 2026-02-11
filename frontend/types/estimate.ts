export interface Estimate {
    id: string;
    laborHours: number;
    totalCost: number;
    timeline: string;
    aiGenerated: boolean;
    aiConfidence?: number;
    notes?: string;
    jobId: string;
    companyId: string;
    createdBy: string;
    createdAt: string;
    materials: EstimateMaterial[];
    job?: {
        title: string;
        address: string;
        jobNumber: string;
    };
    creator?: {
        firstName: string;
        lastName: string;
    };
}

export interface EstimateMaterial {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    estimatedCost: number;
    estimateId: string;
}
