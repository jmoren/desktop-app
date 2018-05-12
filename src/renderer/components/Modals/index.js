import Vue from "vue";
import NewTable from "@/components/Modals/NewTable";
import NewClient from "@/components/Modals/NewClient";
import OpenTable from "@/components/Modals/OpenTable";
import NewTicketDelivery from "@/components/Modals/NewTicketDelivery";

Vue.component("new-table", NewTable);
Vue.component("new-client", NewClient);
Vue.component("open-table", OpenTable);
Vue.component("new-ticket-delivery", NewTicketDelivery);

export default {
  NewTable,
  NewClient,
  OpenTable,
  NewTicketDelivery
};
