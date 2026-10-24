const UNAVAILABLE_MESSAGE = "Monnify Bills operations are unavailable until Bills API activation and the exact API contract are verified.";

function unavailable(operation) {
  return {
    ok: false,
    available: false,
    status: "contract_unverified",
    operation,
    message: UNAVAILABLE_MESSAGE
  };
}

class MonnifyBillsAdapter {
  getReadiness() {
    return {
      billsApiActivation: {
        ready: false,
        status: "unconfirmed",
        blocker: "monnify_bills_api_activation_unconfirmed"
      },
      verifiedApiContract: {
        ready: false,
        status: "unverified",
        blocker: "monnify_bills_api_contract_unverified"
      },
      catalogueAccess: {
        ready: false,
        status: "unavailable",
        blocker: "monnify_bills_catalogue_access_unverified"
      },
      vendingAndReconciliation: {
        ready: false,
        status: "unavailable",
        blocker: "monnify_bills_vending_and_reconciliation_unverified"
      }
    };
  }

  async listCategories() {
    return unavailable("listCategories");
  }

  async listBillersByCategory(_categoryCode) {
    return unavailable("listBillersByCategory");
  }

  async listProductsByBiller(_billerCode) {
    return unavailable("listProductsByBiller");
  }

  async validateCustomer(_productCode, _customerId) {
    return unavailable("validateCustomer");
  }

  async vendBill({
    productCode,
    customerId,
    vendAmount,
    vendReference,
    validationReference
  } = {}) {
    return unavailable("vendBill");
  }

  async requeryVendReference({ vendReference, transactionReference } = {}) {
    return unavailable("requeryVendReference");
  }
}

function createMonnifyBillsAdapter() {
  return new MonnifyBillsAdapter();
}

module.exports = {
  createMonnifyBillsAdapter
};
