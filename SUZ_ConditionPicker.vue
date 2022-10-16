<template>
<div class="p-d-flex p-flex-column">
  <div class="p-mx-3 p-d-flex p-flex-row">
    <p class="p-m-0" style="font-size: 0.9rem;  ">Дата загрузки:</p>
      <div class="p-ml-3" v-for="date of dateModes" :key="date.key">
        <RadioButton name="date" :value="date" v-model="dateMode" />
        <label :for="date.key" class="p-ml-1">{{date.name}}</label>
      </div>
  </div>
  <div style="min-height: 4rem" class="p-d-flex p-flex-row p-ai-center p-mb-1 p-mx-3">
    <div style="width: 28vw" class="p-mr-2">
      <YearAndQuarterPicker
        v-if="dateMode.key ==='quarter'"
        :yearToStart=2019
        @setDateFromDateTo="setDateFromDateTo"
      />
      <DatePicker
        v-if="dateMode.key ==='vary'"
        @setDateFromDateTo="setDateFromDateTo"
      />
    </div>
    <div class="p-d-flex p-flex-row p-flex-wrap">
      <div v-if="isGroup" class="p-d-flex p-flex-column p-mr-1 p-mb-1">
        <p class="p-mt-0 p-mb-1" style="font-size: 0.8rem">Выбор ОГ:</p>
        <GroupSelector
          @setNewGroups="setNewGroups"
          ref="groupSelector"
          :reqTitle="'SuzDashboard'"
          :reqName="'Customers'"
        />
      </div>
      <div v-if="isExpertise" class="p-d-flex p-flex-column p-mr-1 p-mb-1">
        <p class="p-mt-0 p-mb-1" style="font-size: 0.8rem">Выбор экспертизы:</p>
        <ExpertiseSelector
          @setNewExpertise="setNewExpertise"
          ref="expertiseSelector"
          :reqTitle="'SuzDashboard'"
          :reqName="'Expertises'"
        />
      </div>
      <div v-if="isDesignStage" class="p-d-flex p-flex-column p-mr-1 p-mb-1">
        <p class="p-mt-0 p-mb-1" style="font-size: 0.8rem">Выбор стадии ПИР:</p>
        <DesignStageSelector
          @setNewDesignStage="setNewDesignStage"
          ref="designStageSelector"
          :reqTitle="'SuzDashboard'"
          :reqName="'ProjectStages'"
        />
      </div>
      <div v-if="isOffices" class="p-d-flex p-flex-column p-mr-1 p-mb-1">
        <p class="p-mt-0 p-mb-1" style="font-size: 0.8rem">Выбор подразделения:</p>
        <OfficesSelector
          @setNewOffices="setNewOffices"
          ref="officesSelector"
          :reqTitle="'SuzDashboard'"
          :reqName="'Departments'"
        />
      </div>
      <div v-if="isButtons" class="p-d-flex p-flex-column p-ai-center p-as-end p-mr-1 p-mb-1">
          <button class="button-control" @click="emptySelectedValues">
            <div class="pi pi-times p-mr-2"></div>
            <div>Сбросить</div>
          </button>
      </div>
      <div v-if="isButtons" class="p-d-flex p-flex-column p-ai-center p-as-end p-mr-1 p-mb-1">
          <button class="button-control" @click="selectAllValue">
            <div class="pi pi-check p-mr-2"></div>
            <div>Выбрать все</div>
          </button>
      </div>
      <div class="p-d-flex p-flex-column p-ai-center p-as-end p-mr-1 p-mb-1">
          <button class="button-control" :style="{'background': companyColors.darkYellow }" @click="passReqObject">
            <div>Применить</div>
          </button>
      </div>
    </div>
  </div>
  <div class="p-d-flex p-flex-column p-mx-3 p-mb-2">
    <div v-if="groupsLabel && groupsLabel[0].value != 0" class="p-d-flex p-flex-row p-flex-wrap">
      <div v-for="(item) in groupsLabel" :key="item.label"
      class="condition-item"
      >
        {{item.label}}
        <i class="pi pi-times" style="color: grey; cursor: pointer;" @click="removeGroups(item)"></i>
      </div>
    </div>
    <div v-if="expertiseLabel && expertiseLabel[0].value != 0" class="p-d-flex p-flex-row p-flex-wrap">
      <div v-for="(item) in expertiseLabel" :key="item.label"
      class="condition-item"
      >
        {{item.label}}
        <i class="pi pi-times" style="color: grey; cursor: pointer;" @click="removeExpertise(item)"></i>
      </div>
    </div>
    <div v-if="designStageLabel && designStageLabel[0].value != 0" class="p-d-flex p-flex-row p-flex-wrap">
      <div v-for="(item) in designStageLabel" :key="item.label"
      class="condition-item"
      >
        {{item.label}}
        <i class="pi pi-times" style="color: grey; cursor: pointer;" @click="removeDesignStage(item)"></i>
      </div>
    </div>
    <div v-if="officesLabel && officesLabel[0].value != 0" class="p-d-flex p-flex-row p-flex-wrap">
      <div v-for="(item) in officesLabel" :key="item.label"
      class="condition-item"
      >
        {{item.label}}
        <i class="pi pi-times" style="color: grey; cursor: pointer;" @click="removeOffices(item)"></i>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import YearAndQuarterPicker from "@/components/SUZ/Selectors/SUZ_YearAndQuarterPicker.vue";
import DatePicker from "@/components/SUZ/Selectors/SUZ_DatePicker.vue";
import ExpertiseSelector from "@/components/SUZ/Selectors/ExpertiseSelector.vue"
import GroupSelector from "@/components/SUZ/Selectors/GroupSelector.vue"
import DesignStageSelector from "@/components/SUZ/Selectors/DesignStageSelector.vue"
import OfficesSelector from "@/components/SUZ/Selectors/OfficesSelector.vue"
import { companyColors } from "@/components/Common_Options/CompanyColors"

export default {
  components: {
    YearAndQuarterPicker,
    DatePicker,
    ExpertiseSelector,
    GroupSelector,
    DesignStageSelector,
    OfficesSelector,
  },
  props: {
    isExpertise: Boolean,
    isGroup: Boolean,
    isDesignStage: Boolean,
    isOffices: Boolean,
    isButtons: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      reqObject: {},
      isInitialLoaded: false,
      dateMode: {name: "По кварталам", key: "quarter"},
      dateModes: [
        {name: "По кварталам", key: "quarter"},
        {name: "Произвольно", key: "vary"},
      ],
      expertiseLabel: null,
      groupsLabel: null,
      designStageLabel: null,
      officesLabel: null,
      companyColors: companyColors,
    }
  },
  watch: {
    combinedReqObject() {
      if (!this.isInitialLoaded) {
        this.passReqObject();
        this.isInitialLoaded = true;
      }
    },
  },
  computed: {
    combinedReqObject() {
      const {dateFrom, dateTo, expertise, groups, designStage, offices} = this.reqObject;
      return {dateFrom, dateTo, expertise, groups, designStage, offices}
    }
  },
  methods: {
    passReqObject() {
      const reqObject = {...this.reqObject}; // Клонирование объекта решает вопрос нарушения одностороннего потока данных. Иначе изменение в дочернем компоненте вызывает изменения в родителе
      this.$emit("passReqObject", reqObject);
    },
    emptySelectedValues() {
      Object.values(this.$refs).forEach(ref => {
        ref.emptySelectedValues();
      });
    },
    selectAllValue() {
      Object.values(this.$refs).forEach(ref => {
        ref.selectAllValue();
      });
    },
    removeExpertise(itemToDelete) {
      this.$refs.expertiseSelector.removeItemFromSelected(itemToDelete);
    },
    removeGroups(itemToDelete) {
      this.$refs.groupSelector.removeItemFromSelected(itemToDelete);
    },
    removeDesignStage(itemToDelete) {
      this.$refs.designStageSelector.removeItemFromSelected(itemToDelete);
    },
    removeOffices(itemToDelete) {
      this.$refs.officesSelector.removeItemFromSelected(itemToDelete);
    },
    setDateFromDateTo(dateFrom, dateTo) {
      if (dateFrom !== null && dateTo !== null) {
        this.reqObject.dateFrom = dateFrom;
        this.reqObject.dateTo = dateTo;
      }
    },
    setNewExpertise(expertise) {
      if (expertise !== null) {
        const expertises = [];
        expertise.forEach(item => expertises.push(item.value));
        this.reqObject.expertise = expertises;
      }
      this.expertiseLabel = expertise;
    },
    setNewGroups(group) {
      if (group !== null) {
        const groups = [];
        group.forEach(item => groups.push(item.value));
        this.reqObject.groups = groups;
      }
      this.groupsLabel = group;
    },
    setNewDesignStage(stage) {
      if (stage !== null) {
        const stages = [];
        stage.forEach(item => stages.push(item.value));
        this.reqObject.designStage = stages;
      }
      this.designStageLabel = stage;
    },
    setNewOffices(office) {
      if (office  !== null) {
        const offices = [];
        office.forEach(item => offices.push(item.value));
        this.reqObject.offices = offices;
      }
      this.officesLabel = office;
    },
  },
}
</script>

<style lang="scss" scoped>
.condition-item {
  font-size: 0.8rem;
  padding: 5px 10px;
  margin: 5px;
  background-color: var(--bluegray-100);
  border-radius: 10px;
  display: flex;
  align-items: center;
  > i {
    margin-left: 0.3rem;
  }
}
:deep .p-radiobutton + label {
  font-size: 0.8rem;
}
:deep .p-radiobutton .p-radiobutton-box.p-highlight {
  border-color: var(--bluegray-500);
  background: var(--bluegray-500);
}
:deep .p-radiobutton .p-radiobutton-box:not(.p-disabled):not(.p-highlight):hover {
  border-color: var(--bluegray-600);
}
:deep .p-radiobutton .p-radiobutton-box.p-highlight:not(.p-disabled):hover {
  border-color: var(--bluegray-600);
  background: var(--bluegray-600);
}

.button-control {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 1rem;
  border: 1px solid var(--bluegray-100)!important;
  border-radius: 3px;
  height: 2rem;
  font-size: 0.8rem;
  background: transparent;

  div {
    line-height: 2rem;
    white-space: nowrap
  }
  > div:first-child {
    color: var(--bluegray-600)
  }
}
.button-control:hover {
  cursor: pointer;
  border-color: var(--blue-500)!important;
}
</style>