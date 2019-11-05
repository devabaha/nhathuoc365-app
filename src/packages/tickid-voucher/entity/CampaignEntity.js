class CampaignEntity {
  constructor(data) {
    this.data = data;
  }

  get isOnlyUseOnline() {
    return !!this.data.only_online;
  }
}

export default CampaignEntity;
