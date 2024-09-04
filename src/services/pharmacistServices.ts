import { pharmacistDataAccess } from "../data access/dataAccess";
import {
  PharmacyOutletType,
  UpdatePharmacyOutletType,
} from "../models/Pharmacy";

const addPharmacistService = async (id: string) => {
  const res = await pharmacistDataAccess.addPharmacist(id);
  if (!res || res.status === 400 || res.status === 500) {
    return {
      status: res.status,
      error: res.message,
    };
  }
  if (res.status === 200) {
    return {
      status: 200,
      message: res.message,
    };
  }
};

const getAllPharmacistsService = async () => {
  const res = await pharmacistDataAccess.getAllPharmacists();
  if (!res || res.status === 400 || res.status === 500) {
    return {
      status: res.status,
      error: res.message,
    };
  }
  if (res.status === 200) {
    return {
      status: 200,
      data: res.data,
    };
  }
};

const deletePharmacistService = async (id: string) => {
  const res = await pharmacistDataAccess.deletePharmacist(id);

  if (!res || res.status === 400 || res.status === 500) {
    return {
      status: res.status,
      error: res.message,
    };
  }
  if (res.status === 200) {
    return {
      status: 200,
      message: res.message,
    };
  }
};

const getPharmacistByIdService = async (id: string) => {
  const res = await pharmacistDataAccess.getPharmacistById(id);
  if (!res || res.status === 400 || res.status === 500) {
    return {
      status: res.status,
      error: res.message,
    };
  }
  if (res.status === 200) {
    return {
      status: 200,
      data: res.data,
    };
  }
};

const addPharmacyOutletService = async (
  userId: string,
  validatedSchema: PharmacyOutletType
) => {
  const res = await pharmacistDataAccess.addPharmacyOutlet(
    userId,
    validatedSchema
  );
  if (!res || res.status === 400 || res.status === 500) {
    return {
      status: res.status,
      error: res.message,
    };
  }
  if (res.status === 201) {
    return {
      status: 201,
      message: res.message,
      data: res.data,
    };
  }
};

const getPharmacyOutletByIdService = async (id: number) => {
  const res = await pharmacistDataAccess.getPharmacyOutletById(id);
  if (!res || res.status === 400 || res.status === 500) {
    return {
      status: res.status,
      error: res.message,
    };
  }
  if (res.status === 200) {
    return {
      status: 200,
      data: res.data,
    };
  }
};

const deletePharmacyOutletService = async (pharmacyOutletId: number) => {
  const res = await pharmacistDataAccess.deletePharmacyOutlet(pharmacyOutletId);
  if (!res || res.status === 400 || res.status === 500) {
    return {
      status: res.status,
      error: res.message,
    };
  }
  if (res.status === 200) {
    return {
      status: 200,
      message: res.message,
    };
  }
};

const getAllPharmacyOutletsService = async () => {
  const res = await pharmacistDataAccess.getAllPharmacyOutlets();
  if (!res || res.status === 400 || res.status === 500) {
    return {
      status: res.status,
      error: res.message,
    };
  }
  if (res.status === 200) {
    return {
      status: 200,
      data: res.data,
    };
  }
};

const updatePharmacyOutletService = async (
  pharmacyOutletId: number,
  validatedSchema: UpdatePharmacyOutletType
) => {
  const res = await pharmacistDataAccess.updatePharmacyOutlet(
    pharmacyOutletId,
    validatedSchema
  );

  if (!res || res.status === 404 || res.status === 400 || res.status === 500) {
    return {
      status: res.status,
      error: res.message,
    };
  }

  if (res.status === 200) {
    return {
      status: 200,
      message: res.message,
      data: res.data,
    };
  }
};

export default {
  addPharmacistService,
  getAllPharmacistsService,
  deletePharmacistService,
  getPharmacistByIdService,
  addPharmacyOutletService,
  getPharmacyOutletByIdService,
  deletePharmacyOutletService,
  getAllPharmacyOutletsService,
  updatePharmacyOutletService,
};
