<style scoped>
html,
body {
  height: 100%;
  width: 100%;
}
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: absolute;
  border-radius: 4px;
  overflow: hidden;
  top: 0;
  bottom: 0;
  width: 100%;
}
.layout-logo {
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.layout-footer-center {
  text-align: center;
}
.demo-split {
  height: 900px;
  border: 1px solid #dcdee2;
}
.demo-split-pane {
  padding: 10px;
}
.road-map-box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  text-align: center;
}

.road-map {
  width: 100%;
  height: 800px;
}
.road-card-box {
  position: relative;
  top: -60px;
}
.road-card {
  position: absolute;
  top: 60px;
  bottom: 0;
  min-width: 400px;
}
.road-button-save {
  height: 32px;
  margin-top: 5px;
}
.road-button-input {
  width: 90%;
}
.road-button {
  width: 80%;
}
.road-card-row {
  margin-bottom: 5px;
}
.road-card-col {
  margin-right: 5px;
}
.road-button-textarea {
  resize: none;
  margin-top: 5px;
}
</style>

<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-nav">
            <MenuItem name="4">
              <Icon type="ios-paper" style="visibility: hidden;"></Icon>
            </MenuItem>
          </div>
          <div>
            <Button type="primary" @click="todo()">自动计算对面边缘点</Button>
            <Button type="primary" @click="remark()">保存，并开始标注新道路</Button>
          </div>
        </Menu>
      </Header>
      <Content>
        <Row>
          <Col span="15">
            <Card dis-hover>
              <div class="road-map-box">
                <div class="map flex-1 road-map" ref="map"></div>
              </div>
            </Card>
          </Col>
          <Col span="8" class="road-card-box">
            <Card dis-hover class="road-card">
              <Row class="road-card-row">
                <Col>
                  <Input placeholder="道路名称" v-model="roadName"/>
                </Col>
              </Row>

              <Row class="road-card-row">
                <Col>
                  <Input placeholder="经纬度" v-model="pointPos"/>
                </Col>
              </Row>

              <Row class="road-card-row">
                <Col>
                  <Input placeholder="本侧车道数量" v-model="count"/>
                </Col>
              </Row>

              <Row class="road-card-row">
                <Col>
                  <Input placeholder="对面车道数量" v-model="reverseCount"/>
                </Col>
              </Row>

              <Row class="road-card-row">
                <Col span="5">道路方向</Col>
                <Col span="19">
                  <Select v-model="roadDirection">
                    <Option value="1">上行</Option>
                    <Option value="2">下行</Option>
                  </Select>
                </Col>
              </Row>
              <Row class="road-card-row">
                <Col span="5">点的类型</Col>
                <Col span="19">
                  <Select v-model="pointType">
                    <Option value="1">起点</Option>
                    <Option value="2">中间点</Option>
                    <Option value="3">终点</Option>
                  </Select>
                </Col>
              </Row>
              <Row class="road-card-row">
                <Col span="5">路口类型</Col>
                <Col span="19">
                  <Select v-model="crossType">
                    <Option value="1">十字路口</Option>
                    <Option value="2">丁字路口</Option>
                    <Option value="3">3岔路口</Option>
                    <Option value="4">4岔路口</Option>
                    <Option value="5">5岔路口</Option>
                  </Select>
                </Col>
              </Row>
              <p>
                <Input
                  v-model="crossInfo"
                  class="road-button-textarea"
                  type="textarea"
                  :rows="4"
                  :autosize="{maxRows:4, minRows: 4}"
                  placeholder="相邻路口名称"
                />
              </p>
              <p class="road-button road-button-save">
                <Button type="primary" @click="savePoint()">保存道路边缘点</Button>
              </p>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
    <Modal v-model="removePointModel" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>Delete confirmation</span>
      </p>
      <div style="text-align:center">
        <p>是否删除道路点？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="removePoint()">删除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import inMap from "inmap";
var isInsert = true;
var imageOverlay,overlay;
var overlayData = [], imageData = [];
export default {
  data() {
    return {
      roadName: "",
      pointPos: "",
      count: "",
      reverseCount: "",
      roadDirection: "",
      pointType: "",
      crossType: "",
      crossInfo: "",
      road: {},
      removePointModel: false
    };
  },
  methods: {
    savePoint: function() {
      let { pointType, roadName, pointPos } = this;

      if (utils.isEmpty(roadName)) {
        return this.$Message.error("道路名称不可为空");
      }

      if (utils.isEmpty(pointPos)) {
        return this.$Message.error("经纬度不可为空");
      }

      if (pointType == 1) {
        createRoad(this);
      } else {
        createPoint(this);
      }
    },
    remark: function() {
      updateRoadStatus(this);
    },
    todo: function() {
      this.$Message.warning("未完待续...");
    },
    removePoint() {
      removeRoadPoint(this);
    }
  },
  mounted() {
    var inmap = new inMap.Map({
      id: this.$refs.map,
      skin: "",
      center: [105.403119, 38.028658],
      zoom: {
        // value: 18,
        show: true,
        max: 18,
        min: 2
      }
    });

    var img = new Image();
    img.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAACWCAYAAAA/mr2PAAAACXBIWXMAAAsTAAALEwEAmpwYAAA4KmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoTWFjaW50b3NoKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxOC0xMi0wOFQxNjo1Njo0OCswODowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE4LTEyLTA5VDEzOjQ0OjI5KzA4OjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxOC0xMi0wOVQxMzo0NDoyOSswODowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MzwvcGhvdG9zaG9wOkNvbG9yTW9kZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDplOTY1NDk4NS1lZDk1LTQ4MmQtODljOC04ZDJkMTliYTZjNjc8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6ZTk2NTQ5ODUtZWQ5NS00ODJkLTg5YzgtOGQyZDE5YmE2YzY3PC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6ZTk2NTQ5ODUtZWQ5NS00ODJkLTg5YzgtOGQyZDE5YmE2YzY3PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOmU5NjU0OTg1LWVkOTUtNDgyZC04OWM4LThkMmQxOWJhNmM2Nzwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxOC0xMi0wOFQxNjo1Njo0OCswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+NjU1MzU8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjExMDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xNTA8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAg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";
    overlay = new inMap.ImgOverlay({
      style: {
        normal: {
          icon: img,
          width: 10,
          height: 15,
          offsets: {
            top: "-100%",
            left: "-50%"
          }
        }
      },
      data: [],
      event: {
        onMouseClick: function(items, event) {
          isInsert = false;
          context.removePointModel = true;
          let item = items[0];
          context.markPoint = item;
        }
      }
    });
    inmap.add(overlay);
    let bmap = inmap.getMap();
    bmap.centerAndZoom("承德", 16);
    var context = this;
    context.overlay = overlay;
    function showInfo(e) {
      if (!isInsert) {
        isInsert = true;
        return;
      }
      overlayData.push({
        geometry: {
          type: "Point",
          coordinates: [e.point.lng, e.point.lat]
        },
        style: {},
        overlayType: 'overlay'
      });
      overlay.setData(overlayData);
      context.pointPos = [e.point.lng, e.point.lat].join(",");
    }
    bmap.addEventListener("click", function(e){
      setTimeout(showInfo, 50, e);
    });
    getRoads(function(_data) {
      imageData = _data;
      var img = new Image();
      img.src =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAABPCAMAAAB4dK3YAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpkYmIyY2ZmOS1mMzM1LTRiMTAtODViYS05NWU2MWE4ZjYxMjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDMwOTVCN0FGMzlBMTFFOEJDQ0REREY3M0ZDRjg5RTMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDMwOTVCNzlGMzlBMTFFOEJDQ0REREY3M0ZDRjg5RTMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpkYmIyY2ZmOS1mMzM1LTRiMTAtODViYS05NWU2MWE4ZjYxMjEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ZGJiMmNmZjktZjMzNS00YjEwLTg1YmEtOTVlNjFhOGY2MTIxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ViIDWAAAAGBQTFRFuN/LQdGIB7thBsBi+fr6XbiLLMt6z+HY3+Lhgtuu5Ovnr9bCPMaAhMmmbMGWwdrLndC3JLtv2N7bT7aBdcyhH8ZyzNfRnOm7EMJpkMisv8vF6+/t8PPyg9etBrde////DyRHQAAAACB0Uk5T/////////////////////////////////////////wBcXBvtAAABwklEQVR42uzXyZKDIBAAUARER4hLDAajgf//y8EtGXeaqrnZJ1P6ggVt0yDzCZo9fw7jGX0fRp8rLpQ+CZkmK1efKhtExAuXuTCtsaAzRwV2cprwmbu7DWddOHMZcXQ68HO4nLlEur7nbT6fD8cBVTx3jduEkny57klAzobERObrPKM8LKYHWLH1iuE73sjP7scwIn6YWO6uwL4jmTGBj3td7nKXu9w/OWBdonysg2nDN/a1oKUbrqmDYnoYq83SXYg0W7qcEX2+Q2AVJjP3cN7/WPTHpc7brW1Goo97A5jWLBkdB7GhF7GuZRoW3eZpXU2ATsvWulZCmSa1dRw8nNaCIpNiuFMRAs/KMDOoKnxcil7ax5Xo6eO0QNyH4RI1wm9eTBRs/eEhK95dntF4HTmZ2tuNm3GyqEvfmPrmqd1cxY5r2KJvdHRmbEcJArpwLKUV0N0Gp+5AN35dsgG6anCMAt1wMMDCAB1lQ95DnSlJ/52BXV/CbQGCuj5Dp1MbwPUnLZKBXZ/ZqgK7vs7JGOz6zGYt3HWZHRi4s9vN/rIfOJvZ0yEY5Gxm71aJI2cze7dKHDmb2QR5OHNTLNm9+SvAACdd3xE0HzYfAAAAAElFTkSuQmCC";
      imageOverlay = new inMap.ImgOverlay({
        style: {
          normal: {
            icon: img,
            width: 10,
            height: 15,
            offsets: {
              top: "-100%",
              left: "-50%"
            }
          }
        },
        data: [],
        event: {
          onMouseClick: function(items, event) {
            isInsert = false;
            context.removePointModel = true;
            let item = items[0];
            context.markPoint = item;
          }
        }
      });
      inmap.add(imageOverlay);
      imageOverlay.setData(imageData);
    });
  }
};

function removeRoadPoint(context) {
  let { markPoint } = context;
  let {
    geometry: { coordinates },
    overlayType
  } = markPoint;
  removePoint(markPoint.markPoint);
  var tmpData = overlayType == 'overlay' ? overlayData : imageData;
  tmpData = tmpData.filter(function(point) {
    let { geometry } = point;
    let points = geometry.coordinates;
    return points[0] != coordinates[0] && points[1] != coordinates[1];
  });
  if(overlayType == 'overlay'){
    overlay.setData(tmpData);
    overlayData = tmpData;
  }else{
    imageOverlay.setData(tmpData);
    imageData = tmpData;
  }
  context.removePointModel = false;
}

var utils = {
  copy: function(target, source) {
    for (var key in source) {
      target[key] = source[key];
    }
  },
  tplEngine: function(temp, data, regexp) {
    if (!(Object.prototype.toString.call(data) === "[object Array]"))
      data = [data];
    var ret = [];
    for (var i = 0, j = data.length; i < j; i++) {
      ret.push(replaceAction(data[i]));
    }
    return ret.join("");

    function replaceAction(object) {
      return temp.replace(regexp || /{([^}]+)}/g, function(match, name) {
        if (match.charAt(0) == "\\") return match.slice(1);
        return object[name] != undefined ? object[name] : "{" + name + "}";
      });
    }
  },
  forEach: function(obj, callback) {
    callback = callback || RongUtil.noop;
    var loopObj = function() {
      for (var key in obj) {
        callback(obj[key], key, obj);
      }
    };
    var loopArr = function() {
      for (var i = 0, len = obj.length; i < len; i++) {
        callback(obj[i], i);
      }
    };
    if (utils.isObject(obj)) {
      loopObj();
    }
    if (utils.isArray(obj)) {
      loopArr();
    }
  },
  isObject: function(obj) {
    return Object.prototype.toString.call(obj) == "[object Object]";
  },
  isArray: function(arr) {
    return Object.prototype.toString.call(arr) == "[object Array]";
  },
  isFunction: function(arr) {
    return Object.prototype.toString.call(arr) == "[object Function]";
  },
  // 暂时支持 string
  isEmpty: function(str) {
    return str.length == 0;
  },
  /* 
      var option = {
        url: '',
        method: '',
        headers: {},
        success: function(){},
        fail: function(){}
      };
    
    */
  ajax: function(option) {
    var getXHR = function() {
      var xhr = null;
      var hasXDomain = function() {
        return typeof XDomainRequest != "undefined";
      };
      var hasXMLRequest = function() {
        return typeof XMLHttpRequest != "undefined";
      };
      if (hasXDomain()) {
        xhr = new XDomainRequest();
      } else if (hasXMLRequest()) {
        xhr = new XMLHttpRequest();
      } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
      return xhr;
    };

    var xhr = getXHR();
    var method = option.method || "GET";
    var url = option.url;
    var body = option.body;
    xhr.open(method, url, true);
    var headers = option.headers || {};
    utils.forEach(headers, function(header, name) {
      xhr.setRequestHeader(name, header);
    });

    var success = option.success || utils.noop;
    var fail = option.fail || utils.noop;
    var isSuccess = function(result) {
      return /^(200|202)$/.test(result.code);
    };

    var onLoad = function() {
      var result = xhr.responseText;
      if (result != "") {
        result = JSON.parse(xhr.responseText);
      }
      if (isSuccess(result)) {
        success(result);
      } else {
        fail(result);
      }
    };
    if ("onload" in xhr) {
      xhr.onload = onLoad;
    } else {
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          onLoad();
        }
      };
    }
    xhr.send(JSON.stringify(body));
  }
};

var getUserId = function() {
  var userId = localStorage.getItem("mark_user");
  if (userId) {
    return userId;
  }
  userId = "user_" + Date.now();
  localStorage.setItem("mark_user", userId);
  return userId;
};

var config = {
  url: "http://47.95.11.208:8585"
};
function createRoad(context) {
  utils.ajax({
    url: config.url + "/road/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      name: context.roadName,
      userId: getUserId()
    },
    success: function(result) {
      let { result: road } = result;
      context.road = road;
      createPoint(context);
    }
  });
}
function createPoint(context) {
  let {
    road,
    pointPos,
    count,
    reverseCount,
    roadDirection,
    pointType,
    crossType,
    crossInfo
  } = context;
  if (!road.id) {
    return context.$Message.error("请先创建起点");
  }
  let pos = pointPos.split(",");
  let log = pos[0],
    lat = pos[1];
  utils.ajax({
    url: config.url + "/point/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      roadId: road.id,
      direction: roadDirection,
      longitude: log,
      latitude: lat,
      type: pointType,
      count: count,
      reverseCount: reverseCount,
      crossType: crossType,
      crossInfo: crossInfo
    },
    success: function(result) {
      var { result } = result;
      var data = context.overlay.getData();
      data.map(function(geo) {
        var {
          geometry: { coordinates }
        } = geo;
        if (coordinates[0] == log && coordinates[1] == lat) {
          geo.markPoint = result;
        }
        return geo;
      });
      context.$Message.success("添加道路点成功");
    }
  });
}
function clear(context) {
  utils.copy(context, {
    roadName: "",
    pointPos: "",
    count: "",
    reverseCount: "",
    roadDirection: "",
    pointType: "",
    crossType: "",
    crossInfo: "",
    road: {}
  });
}
function updateRoadStatus(context) {
  let { road } = context;
  if (!road.id) {
    return context.$Message.error("请先创建起点");
  }
  utils.ajax({
    url: config.url + "/road/edit",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      id: road.id,
      status: 2
    },
    success: function(result) {
      clear(context);
      context.$Message.success("保存道路成功");
    }
  });
}
function removePoint(point) {
  if (!point) {
    return;
  }
  utils.ajax({
    url: config.url + "/point/remove",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      id: point.id
    },
    success: function(result) {
      console.log("删除点成功");
    }
  });
}

function getRoads(callback) {
  utils.ajax({
    url: config.url + "/road/findAll",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      userId: getUserId()
    },
    success: function(result) {
      let { result: points } = result;
      let data = [];
      points.forEach(point => {
        let roadId = point.roadId;
        let r = roadId * 27;
        let g = roadId * 18;
        let a = roadId * 7;
        data.push({
          geometry: {
            type: "Point",
            coordinates: [point.longitude, point.latitude]
          },
          style: {
            backgroundColor: "rgb(" + r + "," + g + "," + a + ")"
          },
          count: [point.longitude, point.latitude].join(','),
          overlayType: 'image',
          markPoint: point
        });
      });
      callback(data);
    }
  });
}
</script>

