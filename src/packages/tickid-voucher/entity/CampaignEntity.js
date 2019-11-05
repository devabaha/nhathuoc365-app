class CampaignEntity {
  constructor(data) {
    this.data = data;
  }

  get isOnlyUseOnline() {
    return !!this.data.only_online;
  }

  get point() {
    return Number(this.data.point);
  }
}

export default CampaignEntity;
