webpackJsonp(["main"],{

/***/ "../../../../../src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../../../../../src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "../../../../../src/app/admin/admin-content/admin-content.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/admin/admin-content/admin-content.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"content-wrapper\">\n  <!-- Content Header (Page header) -->\n  <section class=\"content-header\">\n    <h1>\n      Dashboard\n      <small>Control panel</small>\n    </h1>\n    <ol class=\"breadcrumb\">\n      <li><a href=\"#\"><i class=\"fa fa-dashboard\"></i> Home</a></li>\n      <li class=\"active\">Dashboard</li>\n    </ol>\n  </section>\n\n  <!-- Main content -->\n  <section class=\"content\">\n    <!-- Small boxes (Stat box) -->\n    <div class=\"row\">\n      <div class=\"col-lg-3 col-xs-6\">\n        <!-- small box -->\n        <div class=\"small-box bg-aqua\">\n          <div class=\"inner\">\n            <h3>150</h3>\n\n            <p>New Orders</p>\n          </div>\n          <div class=\"icon\">\n            <i class=\"ion ion-bag\"></i>\n          </div>\n          <a href=\"#\" class=\"small-box-footer\">More info <i class=\"fa fa-arrow-circle-right\"></i></a>\n        </div>\n      </div>\n      <!-- ./col -->\n      <div class=\"col-lg-3 col-xs-6\">\n        <!-- small box -->\n        <div class=\"small-box bg-green\">\n          <div class=\"inner\">\n            <h3>53<sup style=\"font-size: 20px\">%</sup></h3>\n\n            <p>Bounce Rate</p>\n          </div>\n          <div class=\"icon\">\n            <i class=\"ion ion-stats-bars\"></i>\n          </div>\n          <a href=\"#\" class=\"small-box-footer\">More info <i class=\"fa fa-arrow-circle-right\"></i></a>\n        </div>\n      </div>\n      <!-- ./col -->\n      <div class=\"col-lg-3 col-xs-6\">\n        <!-- small box -->\n        <div class=\"small-box bg-yellow\">\n          <div class=\"inner\">\n            <h3>44</h3>\n\n            <p>User Registrations</p>\n          </div>\n          <div class=\"icon\">\n            <i class=\"ion ion-person-add\"></i>\n          </div>\n          <a href=\"#\" class=\"small-box-footer\">More info <i class=\"fa fa-arrow-circle-right\"></i></a>\n        </div>\n      </div>\n      <!-- ./col -->\n      <div class=\"col-lg-3 col-xs-6\">\n        <!-- small box -->\n        <div class=\"small-box bg-red\">\n          <div class=\"inner\">\n            <h3>65</h3>\n\n            <p>Unique Visitors</p>\n          </div>\n          <div class=\"icon\">\n            <i class=\"ion ion-pie-graph\"></i>\n          </div>\n          <a href=\"#\" class=\"small-box-footer\">More info <i class=\"fa fa-arrow-circle-right\"></i></a>\n        </div>\n      </div>\n      <!-- ./col -->\n    </div>\n    <!-- /.row -->\n    <!-- Main row -->\n    <div class=\"row\">\n      <!-- Left col -->\n      <section class=\"col-lg-7 connectedSortable\">\n        <!-- Custom tabs (Charts with tabs)-->\n        <div class=\"nav-tabs-custom\">\n          <!-- Tabs within a box -->\n          <ul class=\"nav nav-tabs pull-right\">\n            <li class=\"active\"><a href=\"#revenue-chart\" data-toggle=\"tab\">Area</a></li>\n            <li><a href=\"#sales-chart\" data-toggle=\"tab\">Donut</a></li>\n            <li class=\"pull-left header\"><i class=\"fa fa-inbox\"></i> Sales</li>\n          </ul>\n          <div class=\"tab-content no-padding\">\n            <!-- Morris chart - Sales -->\n            <div class=\"chart tab-pane active\" id=\"revenue-chart\" style=\"position: relative; height: 300px;\"></div>\n            <div class=\"chart tab-pane\" id=\"sales-chart\" style=\"position: relative; height: 300px;\"></div>\n          </div>\n        </div>\n        <!-- /.nav-tabs-custom -->\n\n        <!-- Chat box -->\n        <div class=\"box box-success\">\n          <div class=\"box-header\">\n            <i class=\"fa fa-comments-o\"></i>\n\n            <h3 class=\"box-title\">Chat</h3>\n\n            <div class=\"box-tools pull-right\" data-toggle=\"tooltip\" title=\"Status\">\n              <div class=\"btn-group\" data-toggle=\"btn-toggle\">\n                <button type=\"button\" class=\"btn btn-default btn-sm active\"><i class=\"fa fa-square text-green\"></i>\n                  </button>\n                <button type=\"button\" class=\"btn btn-default btn-sm\"><i class=\"fa fa-square text-red\"></i></button>\n              </div>\n            </div>\n          </div>\n          <div class=\"box-body chat\" id=\"chat-box\">\n            <!-- chat item -->\n            <div class=\"item\">\n              <img src=\"assets/img/user4-128x128.jpg\" alt=\"user image\" class=\"online\">\n\n              <p class=\"message\">\n                <a href=\"#\" class=\"name\">\n                    <small class=\"text-muted pull-right\"><i class=\"fa fa-clock-o\"></i> 2:15</small>\n                    Mike Doe\n                  </a> I would like to meet you to discuss the latest news about the arrival of the new theme.\n                They say it is going to be one the best themes on the market\n              </p>\n              <div class=\"attachment\">\n                <h4>Attachments:</h4>\n\n                <p class=\"filename\">\n                  Theme-thumbnail-image.jpg\n                </p>\n\n                <div class=\"pull-right\">\n                  <button type=\"button\" class=\"btn btn-primary btn-sm btn-flat\">Open</button>\n                </div>\n              </div>\n              <!-- /.attachment -->\n            </div>\n            <!-- /.item -->\n            <!-- chat item -->\n            <div class=\"item\">\n              <img src=\"assets/img/user3-128x128.jpg\" alt=\"user image\" class=\"offline\">\n\n              <p class=\"message\">\n                <a href=\"#\" class=\"name\">\n                    <small class=\"text-muted pull-right\"><i class=\"fa fa-clock-o\"></i> 5:15</small>\n                    Alexander Pierce\n                  </a> I would like to meet you to discuss the latest news about the arrival of the new theme.\n                They say it is going to be one the best themes on the market\n              </p>\n            </div>\n            <!-- /.item -->\n            <!-- chat item -->\n            <div class=\"item\">\n              <img src=\"assets/img/user2-160x160.jpg\" alt=\"user image\" class=\"offline\">\n\n              <p class=\"message\">\n                <a href=\"#\" class=\"name\">\n                    <small class=\"text-muted pull-right\"><i class=\"fa fa-clock-o\"></i> 5:30</small>\n                    Susan Doe\n                  </a> I would like to meet you to discuss the latest news about the arrival of the new theme.\n                They say it is going to be one the best themes on the market\n              </p>\n            </div>\n            <!-- /.item -->\n          </div>\n          <!-- /.chat -->\n          <div class=\"box-footer\">\n            <div class=\"input-group\">\n              <input class=\"form-control\" placeholder=\"Type message...\">\n\n              <div class=\"input-group-btn\">\n                <button type=\"button\" class=\"btn btn-success\"><i class=\"fa fa-plus\"></i></button>\n              </div>\n            </div>\n          </div>\n        </div>\n        <!-- /.box (chat box) -->\n\n        <!-- TO DO List -->\n        <div class=\"box box-primary\">\n          <div class=\"box-header\">\n            <i class=\"ion ion-clipboard\"></i>\n\n            <h3 class=\"box-title\">To Do List</h3>\n\n            <div class=\"box-tools pull-right\">\n              <ul class=\"pagination pagination-sm inline\">\n                <li><a href=\"#\">&laquo;</a></li>\n                <li><a href=\"#\">1</a></li>\n                <li><a href=\"#\">2</a></li>\n                <li><a href=\"#\">3</a></li>\n                <li><a href=\"#\">&raquo;</a></li>\n              </ul>\n            </div>\n          </div>\n          <!-- /.box-header -->\n          <div class=\"box-body\">\n            <ul class=\"todo-list\">\n              <li>\n                <!-- drag handle -->\n                <span class=\"handle\">\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                      </span>\n                <!-- checkbox -->\n                <input type=\"checkbox\" value=\"\">\n                <!-- todo text -->\n                <span class=\"text\">Design a nice theme</span>\n                <!-- Emphasis label -->\n                <small class=\"label label-danger\"><i class=\"fa fa-clock-o\"></i> 2 mins</small>\n                <!-- General tools such as edit or delete-->\n                <div class=\"tools\">\n                  <i class=\"fa fa-edit\"></i>\n                  <i class=\"fa fa-trash-o\"></i>\n                </div>\n              </li>\n              <li>\n                <span class=\"handle\">\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                      </span>\n                <input type=\"checkbox\" value=\"\">\n                <span class=\"text\">Make the theme responsive</span>\n                <small class=\"label label-info\"><i class=\"fa fa-clock-o\"></i> 4 hours</small>\n                <div class=\"tools\">\n                  <i class=\"fa fa-edit\"></i>\n                  <i class=\"fa fa-trash-o\"></i>\n                </div>\n              </li>\n              <li>\n                <span class=\"handle\">\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                      </span>\n                <input type=\"checkbox\" value=\"\">\n                <span class=\"text\">Let theme shine like a star</span>\n                <small class=\"label label-warning\"><i class=\"fa fa-clock-o\"></i> 1 day</small>\n                <div class=\"tools\">\n                  <i class=\"fa fa-edit\"></i>\n                  <i class=\"fa fa-trash-o\"></i>\n                </div>\n              </li>\n              <li>\n                <span class=\"handle\">\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                      </span>\n                <input type=\"checkbox\" value=\"\">\n                <span class=\"text\">Let theme shine like a star</span>\n                <small class=\"label label-success\"><i class=\"fa fa-clock-o\"></i> 3 days</small>\n                <div class=\"tools\">\n                  <i class=\"fa fa-edit\"></i>\n                  <i class=\"fa fa-trash-o\"></i>\n                </div>\n              </li>\n              <li>\n                <span class=\"handle\">\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                      </span>\n                <input type=\"checkbox\" value=\"\">\n                <span class=\"text\">Check your messages and notifications</span>\n                <small class=\"label label-primary\"><i class=\"fa fa-clock-o\"></i> 1 week</small>\n                <div class=\"tools\">\n                  <i class=\"fa fa-edit\"></i>\n                  <i class=\"fa fa-trash-o\"></i>\n                </div>\n              </li>\n              <li>\n                <span class=\"handle\">\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                      </span>\n                <input type=\"checkbox\" value=\"\">\n                <span class=\"text\">Let theme shine like a star</span>\n                <small class=\"label label-default\"><i class=\"fa fa-clock-o\"></i> 1 month</small>\n                <div class=\"tools\">\n                  <i class=\"fa fa-edit\"></i>\n                  <i class=\"fa fa-trash-o\"></i>\n                </div>\n              </li>\n            </ul>\n          </div>\n          <!-- /.box-body -->\n          <div class=\"box-footer clearfix no-border\">\n            <button type=\"button\" class=\"btn btn-default pull-right\"><i class=\"fa fa-plus\"></i> Add item</button>\n          </div>\n        </div>\n        <!-- /.box -->\n\n        <!-- quick email widget -->\n        <div class=\"box box-info\">\n          <div class=\"box-header\">\n            <i class=\"fa fa-envelope\"></i>\n\n            <h3 class=\"box-title\">Quick Email</h3>\n            <!-- tools box -->\n            <div class=\"pull-right box-tools\">\n              <button type=\"button\" class=\"btn btn-info btn-sm\" data-widget=\"remove\" data-toggle=\"tooltip\" title=\"Remove\">\n                  <i class=\"fa fa-times\"></i></button>\n            </div>\n            <!-- /. tools -->\n          </div>\n          <div class=\"box-body\">\n            <form action=\"#\" method=\"post\">\n              <div class=\"form-group\">\n                <input type=\"email\" class=\"form-control\" name=\"emailto\" placeholder=\"Email to:\">\n              </div>\n              <div class=\"form-group\">\n                <input type=\"text\" class=\"form-control\" name=\"subject\" placeholder=\"Subject\">\n              </div>\n              <div>\n                <textarea class=\"textarea\" placeholder=\"Message\" style=\"width: 100%; height: 125px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;\"></textarea>\n              </div>\n            </form>\n          </div>\n          <div class=\"box-footer clearfix\">\n            <button type=\"button\" class=\"pull-right btn btn-default\" id=\"sendEmail\">Send\n                <i class=\"fa fa-arrow-circle-right\"></i></button>\n          </div>\n        </div>\n\n      </section>\n      <!-- /.Left col -->\n      <!-- right col (We are only adding the ID to make the widgets sortable)-->\n      <section class=\"col-lg-5 connectedSortable\">\n\n        <!-- Map box -->\n        <div class=\"box box-solid bg-light-blue-gradient\">\n          <div class=\"box-header\">\n            <!-- tools box -->\n            <div class=\"pull-right box-tools\">\n              <button type=\"button\" class=\"btn btn-primary btn-sm daterange pull-right\" data-toggle=\"tooltip\" title=\"Date range\">\n                  <i class=\"fa fa-calendar\"></i></button>\n              <button type=\"button\" class=\"btn btn-primary btn-sm pull-right\" data-widget=\"collapse\" data-toggle=\"tooltip\" title=\"Collapse\"\n                style=\"margin-right: 5px;\">\n                  <i class=\"fa fa-minus\"></i></button>\n            </div>\n            <!-- /. tools -->\n\n            <i class=\"fa fa-map-marker\"></i>\n\n            <h3 class=\"box-title\">\n              Visitors\n            </h3>\n          </div>\n          <div class=\"box-body\">\n            <div id=\"world-map\" style=\"height: 250px; width: 100%;\"></div>\n          </div>\n          <!-- /.box-body-->\n          <div class=\"box-footer no-border\">\n            <div class=\"row\">\n              <div class=\"col-xs-4 text-center\" style=\"border-right: 1px solid #f4f4f4\">\n                <div id=\"sparkline-1\"></div>\n                <div class=\"knob-label\">Visitors</div>\n              </div>\n              <!-- ./col -->\n              <div class=\"col-xs-4 text-center\" style=\"border-right: 1px solid #f4f4f4\">\n                <div id=\"sparkline-2\"></div>\n                <div class=\"knob-label\">Online</div>\n              </div>\n              <!-- ./col -->\n              <div class=\"col-xs-4 text-center\">\n                <div id=\"sparkline-3\"></div>\n                <div class=\"knob-label\">Exists</div>\n              </div>\n              <!-- ./col -->\n            </div>\n            <!-- /.row -->\n          </div>\n        </div>\n        <!-- /.box -->\n\n        <!-- solid sales graph -->\n        <div class=\"box box-solid bg-teal-gradient\">\n          <div class=\"box-header\">\n            <i class=\"fa fa-th\"></i>\n\n            <h3 class=\"box-title\">Sales Graph</h3>\n\n            <div class=\"box-tools pull-right\">\n              <button type=\"button\" class=\"btn bg-teal btn-sm\" data-widget=\"collapse\"><i class=\"fa fa-minus\"></i>\n                </button>\n              <button type=\"button\" class=\"btn bg-teal btn-sm\" data-widget=\"remove\"><i class=\"fa fa-times\"></i>\n                </button>\n            </div>\n          </div>\n          <div class=\"box-body border-radius-none\">\n            <div class=\"chart\" id=\"line-chart\" style=\"height: 250px;\"></div>\n          </div>\n          <!-- /.box-body -->\n          <div class=\"box-footer no-border\">\n            <div class=\"row\">\n              <div class=\"col-xs-4 text-center\" style=\"border-right: 1px solid #f4f4f4\">\n                <input type=\"text\" class=\"knob\" data-readonly=\"true\" value=\"20\" data-width=\"60\" data-height=\"60\" data-fgColor=\"#39CCCC\">\n\n                <div class=\"knob-label\">Mail-Orders</div>\n              </div>\n              <!-- ./col -->\n              <div class=\"col-xs-4 text-center\" style=\"border-right: 1px solid #f4f4f4\">\n                <input type=\"text\" class=\"knob\" data-readonly=\"true\" value=\"50\" data-width=\"60\" data-height=\"60\" data-fgColor=\"#39CCCC\">\n\n                <div class=\"knob-label\">Online</div>\n              </div>\n              <!-- ./col -->\n              <div class=\"col-xs-4 text-center\">\n                <input type=\"text\" class=\"knob\" data-readonly=\"true\" value=\"30\" data-width=\"60\" data-height=\"60\" data-fgColor=\"#39CCCC\">\n\n                <div class=\"knob-label\">In-Store</div>\n              </div>\n              <!-- ./col -->\n            </div>\n            <!-- /.row -->\n          </div>\n          <!-- /.box-footer -->\n        </div>\n        <!-- /.box -->\n\n        <!-- Calendar -->\n        <div class=\"box box-solid bg-green-gradient\">\n          <div class=\"box-header\">\n            <i class=\"fa fa-calendar\"></i>\n\n            <h3 class=\"box-title\">Calendar</h3>\n            <!-- tools box -->\n            <div class=\"pull-right box-tools\">\n              <!-- button with a dropdown -->\n              <div class=\"btn-group\">\n                <button type=\"button\" class=\"btn btn-success btn-sm dropdown-toggle\" data-toggle=\"dropdown\">\n                    <i class=\"fa fa-bars\"></i></button>\n                <ul class=\"dropdown-menu pull-right\" role=\"menu\">\n                  <li><a href=\"#\">Add new event</a></li>\n                  <li><a href=\"#\">Clear events</a></li>\n                  <li class=\"divider\"></li>\n                  <li><a href=\"#\">View calendar</a></li>\n                </ul>\n              </div>\n              <button type=\"button\" class=\"btn btn-success btn-sm\" data-widget=\"collapse\"><i class=\"fa fa-minus\"></i>\n                </button>\n              <button type=\"button\" class=\"btn btn-success btn-sm\" data-widget=\"remove\"><i class=\"fa fa-times\"></i>\n                </button>\n            </div>\n            <!-- /. tools -->\n          </div>\n          <!-- /.box-header -->\n          <div class=\"box-body no-padding\">\n            <!--The calendar -->\n            <div id=\"calendar\" style=\"width: 100%\"></div>\n          </div>\n          <!-- /.box-body -->\n          <div class=\"box-footer text-black\">\n            <div class=\"row\">\n              <div class=\"col-sm-6\">\n                <!-- Progress bars -->\n                <div class=\"clearfix\">\n                  <span class=\"pull-left\">Task #1</span>\n                  <small class=\"pull-right\">90%</small>\n                </div>\n                <div class=\"progress xs\">\n                  <div class=\"progress-bar progress-bar-green\" style=\"width: 90%;\"></div>\n                </div>\n\n                <div class=\"clearfix\">\n                  <span class=\"pull-left\">Task #2</span>\n                  <small class=\"pull-right\">70%</small>\n                </div>\n                <div class=\"progress xs\">\n                  <div class=\"progress-bar progress-bar-green\" style=\"width: 70%;\"></div>\n                </div>\n              </div>\n              <!-- /.col -->\n              <div class=\"col-sm-6\">\n                <div class=\"clearfix\">\n                  <span class=\"pull-left\">Task #3</span>\n                  <small class=\"pull-right\">60%</small>\n                </div>\n                <div class=\"progress xs\">\n                  <div class=\"progress-bar progress-bar-green\" style=\"width: 60%;\"></div>\n                </div>\n\n                <div class=\"clearfix\">\n                  <span class=\"pull-left\">Task #4</span>\n                  <small class=\"pull-right\">40%</small>\n                </div>\n                <div class=\"progress xs\">\n                  <div class=\"progress-bar progress-bar-green\" style=\"width: 40%;\"></div>\n                </div>\n              </div>\n              <!-- /.col -->\n            </div>\n            <!-- /.row -->\n          </div>\n        </div>\n        <!-- /.box -->\n\n      </section>\n      <!-- right col -->\n    </div>\n    <!-- /.row (main row) -->\n\n  </section>\n  <!-- /.content -->\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/admin/admin-content/admin-content.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminContentComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AdminContentComponent = (function () {
    function AdminContentComponent() {
    }
    AdminContentComponent.prototype.ngOnInit = function () {
    };
    AdminContentComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-admin-content',
            template: __webpack_require__("../../../../../src/app/admin/admin-content/admin-content.component.html"),
            styles: [__webpack_require__("../../../../../src/app/admin/admin-content/admin-content.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], AdminContentComponent);
    return AdminContentComponent;
}());



/***/ }),

/***/ "../../../../../src/app/admin/admin-control-sidebar/admin-control-sidebar.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/admin/admin-control-sidebar/admin-control-sidebar.component.html":
/***/ (function(module, exports) {

module.exports = "<aside class=\"control-sidebar control-sidebar-dark\">\n  <!-- Create the tabs -->\n  <ul class=\"nav nav-tabs nav-justified control-sidebar-tabs\">\n    <li><a href=\"#control-sidebar-home-tab\" data-toggle=\"tab\"><i class=\"fa fa-home\"></i></a></li>\n    <li><a href=\"#control-sidebar-settings-tab\" data-toggle=\"tab\"><i class=\"fa fa-gears\"></i></a></li>\n  </ul>\n  <!-- Tab panes -->\n  <div class=\"tab-content\">\n    <!-- Home tab content -->\n    <div class=\"tab-pane\" id=\"control-sidebar-home-tab\">\n      <h3 class=\"control-sidebar-heading\">Recent Activity</h3>\n      <ul class=\"control-sidebar-menu\">\n        <li>\n          <a href=\"javascript:void(0)\">\n              <i class=\"menu-icon fa fa-birthday-cake bg-red\"></i>\n\n              <div class=\"menu-info\">\n                <h4 class=\"control-sidebar-subheading\">Langdon's Birthday</h4>\n\n                <p>Will be 23 on April 24th</p>\n              </div>\n            </a>\n        </li>\n        <li>\n          <a href=\"javascript:void(0)\">\n              <i class=\"menu-icon fa fa-user bg-yellow\"></i>\n\n              <div class=\"menu-info\">\n                <h4 class=\"control-sidebar-subheading\">Frodo Updated His Profile</h4>\n\n                <p>New phone +1(800)555-1234</p>\n              </div>\n            </a>\n        </li>\n        <li>\n          <a href=\"javascript:void(0)\">\n              <i class=\"menu-icon fa fa-envelope-o bg-light-blue\"></i>\n\n              <div class=\"menu-info\">\n                <h4 class=\"control-sidebar-subheading\">Nora Joined Mailing List</h4>\n\n                <p>nora@example.com</p>\n              </div>\n            </a>\n        </li>\n        <li>\n          <a href=\"javascript:void(0)\">\n              <i class=\"menu-icon fa fa-file-code-o bg-green\"></i>\n\n              <div class=\"menu-info\">\n                <h4 class=\"control-sidebar-subheading\">Cron Job 254 Executed</h4>\n\n                <p>Execution time 5 seconds</p>\n              </div>\n            </a>\n        </li>\n      </ul>\n      <!-- /.control-sidebar-menu -->\n\n      <h3 class=\"control-sidebar-heading\">Tasks Progress</h3>\n      <ul class=\"control-sidebar-menu\">\n        <li>\n          <a href=\"javascript:void(0)\">\n            <h4 class=\"control-sidebar-subheading\">\n              Custom Template Design\n              <span class=\"label label-danger pull-right\">70%</span>\n            </h4>\n\n            <div class=\"progress progress-xxs\">\n              <div class=\"progress-bar progress-bar-danger\" style=\"width: 70%\"></div>\n            </div>\n          </a>\n        </li>\n        <li>\n          <a href=\"javascript:void(0)\">\n            <h4 class=\"control-sidebar-subheading\">\n              Update Resume\n              <span class=\"label label-success pull-right\">95%</span>\n            </h4>\n\n            <div class=\"progress progress-xxs\">\n              <div class=\"progress-bar progress-bar-success\" style=\"width: 95%\"></div>\n            </div>\n          </a>\n        </li>\n        <li>\n          <a href=\"javascript:void(0)\">\n            <h4 class=\"control-sidebar-subheading\">\n              Laravel Integration\n              <span class=\"label label-warning pull-right\">50%</span>\n            </h4>\n\n            <div class=\"progress progress-xxs\">\n              <div class=\"progress-bar progress-bar-warning\" style=\"width: 50%\"></div>\n            </div>\n          </a>\n        </li>\n        <li>\n          <a href=\"javascript:void(0)\">\n            <h4 class=\"control-sidebar-subheading\">\n              Back End Framework\n              <span class=\"label label-primary pull-right\">68%</span>\n            </h4>\n\n            <div class=\"progress progress-xxs\">\n              <div class=\"progress-bar progress-bar-primary\" style=\"width: 68%\"></div>\n            </div>\n          </a>\n        </li>\n      </ul>\n      <!-- /.control-sidebar-menu -->\n\n    </div>\n    <!-- /.tab-pane -->\n    <!-- Stats tab content -->\n    <div class=\"tab-pane\" id=\"control-sidebar-stats-tab\">Stats Tab Content</div>\n    <!-- /.tab-pane -->\n    <!-- Settings tab content -->\n    <div class=\"tab-pane\" id=\"control-sidebar-settings-tab\">\n      <form method=\"post\">\n        <h3 class=\"control-sidebar-heading\">General Settings</h3>\n\n        <div class=\"form-group\">\n          <label class=\"control-sidebar-subheading\">\n              Report panel usage\n              <input type=\"checkbox\" class=\"pull-right\" checked>\n            </label>\n\n          <p>\n            Some information about this general settings option\n          </p>\n        </div>\n        <!-- /.form-group -->\n\n        <div class=\"form-group\">\n          <label class=\"control-sidebar-subheading\">\n              Allow mail redirect\n              <input type=\"checkbox\" class=\"pull-right\" checked>\n            </label>\n\n          <p>\n            Other sets of options are available\n          </p>\n        </div>\n        <!-- /.form-group -->\n\n        <div class=\"form-group\">\n          <label class=\"control-sidebar-subheading\">\n              Expose author name in posts\n              <input type=\"checkbox\" class=\"pull-right\" checked>\n            </label>\n\n          <p>\n            Allow the user to show his name in blog posts\n          </p>\n        </div>\n        <!-- /.form-group -->\n\n        <h3 class=\"control-sidebar-heading\">Chat Settings</h3>\n\n        <div class=\"form-group\">\n          <label class=\"control-sidebar-subheading\">\n              Show me as online\n              <input type=\"checkbox\" class=\"pull-right\" checked>\n            </label>\n        </div>\n        <!-- /.form-group -->\n\n        <div class=\"form-group\">\n          <label class=\"control-sidebar-subheading\">\n              Turn off notifications\n              <input type=\"checkbox\" class=\"pull-right\">\n            </label>\n        </div>\n        <!-- /.form-group -->\n\n        <div class=\"form-group\">\n          <label class=\"control-sidebar-subheading\">\n              Delete chat history\n              <a href=\"javascript:void(0)\" class=\"text-red pull-right\"><i class=\"fa fa-trash-o\"></i></a>\n            </label>\n        </div>\n        <!-- /.form-group -->\n      </form>\n    </div>\n    <!-- /.tab-pane -->\n  </div>\n</aside>\n<!-- Add the sidebar's background. This div must be placed\n       immediately after the control sidebar -->\n<div class=\"control-sidebar-bg\"></div>\n"

/***/ }),

/***/ "../../../../../src/app/admin/admin-control-sidebar/admin-control-sidebar.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminControlSidebarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AdminControlSidebarComponent = (function () {
    function AdminControlSidebarComponent() {
    }
    AdminControlSidebarComponent.prototype.ngOnInit = function () {
    };
    AdminControlSidebarComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-admin-control-sidebar',
            template: __webpack_require__("../../../../../src/app/admin/admin-control-sidebar/admin-control-sidebar.component.html"),
            styles: [__webpack_require__("../../../../../src/app/admin/admin-control-sidebar/admin-control-sidebar.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], AdminControlSidebarComponent);
    return AdminControlSidebarComponent;
}());



/***/ }),

/***/ "../../../../../src/app/admin/admin-dashboard/admin-dashboard.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/admin/admin-dashboard/admin-dashboard.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"content-wrapper\">\n  <!-- Content Header (Page header) -->\n  <section class=\"content-header\">\n    <!-- <h1>\n      Dashboard\n      <small>Version 2.0</small>\n    </h1> -->\n    <!-- <ol class=\"breadcrumb\">\n      <li><a href=\"#\"><i class=\"fa fa-dashboard\"></i> Home</a></li>\n      <li class=\"active\">Dashboard</li>\n    </ol> -->\n  </section>\n\n  <!-- Main content -->\n  <section class=\"content\">\n    <!-- Info boxes -->\n    <div class=\"row\">\n      \n        <div class=\"box box-success col-md-12\">\n          <div class=\"box-header with-border\">\n            <h3 class=\"box-title\">Application Status</h3>\n          </div>\n          <div class=\"col-md-2 col-sm-6 col-xs-12\">\n            <div class=\"info-box\">\n              <span class=\"info-box-icon bg-aqua\">\n                <i class=\"ion ion-ios-people-outline\"></i>\n              </span>\n\n              <div class=\"info-box-content\">\n                <span class=\"info-box-text\">Total</span>\n                <span class=\"info-box-number\">978</span>\n              </div>\n              <!-- /.info-box-content -->\n            </div>\n            <!-- /.info-box -->\n          </div>\n          <!-- /.col -->\n          <div class=\"col-md-2 col-sm-6 col-xs-12\">\n            <div class=\"info-box\">\n              <span class=\"info-box-icon bg-blue\">\n                <i class=\"ion ion-ios-people-outline\"></i>\n              </span>\n\n              <div class=\"info-box-content\">\n                <span class=\"info-box-text\">Pending</span>\n                <span class=\"info-box-number\">100</span>\n              </div>\n            </div>\n          </div>\n          <div class=\"col-md-2 col-sm-6 col-xs-12\">\n            <div class=\"info-box\">\n              <span class=\"info-box-icon bg-lime\">\n                <i class=\"ion ion-ios-people-outline\"></i>\n              </span>\n\n              <div class=\"info-box-content\">\n                <span class=\"info-box-text\">InProcess</span>\n                <span class=\"info-box-number\">78</span>\n              </div>\n            </div>\n          </div>\n          <div class=\"col-md-2 col-sm-6 col-xs-12\">\n            <div class=\"info-box\">\n              <span class=\"info-box-icon bg-yellow\">\n                <i class=\"ion ion-ios-people-outline\"></i>\n              </span>\n\n              <div class=\"info-box-content\">\n                <span class=\"info-box-text\">Expired</span>\n                <span class=\"info-box-number\">200</span>\n              </div>\n            </div>\n          </div>\n          <!-- fix for small devices only -->\n          <div class=\"clearfix visible-sm-block\"></div>\n\n          <div class=\"col-md-2 col-sm-6 col-xs-12\">\n            <div class=\"info-box\">\n              <span class=\"info-box-icon bg-red\">\n                <i class=\"ion ion-ios-people-outline\"></i>\n              </span>\n\n              <div class=\"info-box-content\">\n                <span class=\"info-box-text\">Rejected</span>\n                <span class=\"info-box-number\">90</span>\n              </div>\n              <!-- /.info-box-content -->\n            </div>\n            <!-- /.info-box -->\n          </div>\n          <!-- /.col -->\n          <div class=\"col-md-2 col-sm-6 col-xs-12\">\n            <div class=\"info-box\">\n              <span class=\"info-box-icon bg-green\">\n                <i class=\"ion ion-ios-people-outline\"></i>\n              </span>\n\n              <div class=\"info-box-content\">\n                <span class=\"info-box-text\">Verified</span>\n                <span class=\"info-box-number\">510</span>\n              </div>\n              <!-- /.info-box-content -->\n            </div>\n            <!-- /.info-box -->\n          </div>\n          <!-- /.col -->\n        </div>\n     \n    </div>\n    <div class=\"row\">\n      <section class=\"col-lg-4 connectedSortable\">\n        <!-- <div class=\"chart tab-pane\" id=\"countryWiseKycDonut\" style=\"position: relative; height: 300px;\"></div> -->\n        <div class=\"box box-primary\">\n          <div class=\"box-header with-border\">\n            <h3 class=\"box-title\">Country Applications </h3>\n          </div>\n          <!-- /.box-header -->\n          <div class=\"box-body\">\n            <div class=\"row\">\n              <div class=\"col-md-12\">\n                <div class=\"chart-responsive\">\n                  <canvas #countryApplicationsCanvas id=\"pieChart\" height=\"110\"></canvas>\n                </div>\n                <!-- ./chart-responsive -->\n              </div>\n              <!-- /.col -->\n              <!-- <div class=\"col-md-4\">\n                  <ul class=\"chart-legend clearfix\">\n                    <li>\n                      <i class=\"fa fa-circle-o text-red\"></i> iOS</li>\n                    <li>\n                      <i class=\"fa fa-circle-o text-green\"></i> Android</li>                 \n                  </ul>\n                </div> -->\n              <!-- /.col -->\n            </div>\n            <!-- /.row -->\n          </div>\n        </div>\n      </section>\n      <section class=\"col-lg-4 connectedSortable\">\n        <div class=\"box box-primary\">\n          <div class=\"box-header with-border\">\n            <h3 class=\"box-title\">Device Usage</h3>\n          </div>\n          <!-- /.box-header -->\n          <div class=\"box-body\">\n            <div class=\"row\">\n              <div class=\"col-md-12\">\n                <div class=\"chart-responsive\">\n                  <canvas #deviceUsageCanvas id=\"pieChart\" height=\"110\"></canvas>\n                </div>\n                <!-- ./chart-responsive -->\n              </div>\n              <!-- /.col -->\n              <!-- <div class=\"col-md-4\">\n                <ul class=\"chart-legend clearfix\">\n                  <li>\n                    <i class=\"fa fa-circle-o text-red\"></i> iOS</li>\n                  <li>\n                    <i class=\"fa fa-circle-o text-green\"></i> Android</li>                 \n                </ul>\n              </div> -->\n              <!-- /.col -->\n            </div>\n            <!-- /.row -->\n          </div>\n        </div>\n      </section>\n\n      <section class=\"col-lg-4 connectedSortable\">\n          <div class=\"box box-primary\">\n            <div class=\"box-header with-border\">\n              <h3 class=\"box-title\">Age Group</h3>\n            </div>\n            <!-- /.box-header -->\n            <div class=\"box-body\">\n              <div class=\"row\">\n                <div class=\"col-md-12\">\n                  <div class=\"chart-responsive\">\n                    <canvas #ageGroupCanvas id=\"pieChart\" height=\"110\"></canvas>\n                  </div>\n                  <!-- ./chart-responsive -->\n                </div>\n                <!-- /.col -->\n                <!-- <div class=\"col-md-4\">\n                  <ul class=\"chart-legend clearfix\">\n                    <li>\n                      <i class=\"fa fa-circle-o text-red\"></i> iOS</li>\n                    <li>\n                      <i class=\"fa fa-circle-o text-green\"></i> Android</li>                 \n                  </ul>\n                </div> -->\n                <!-- /.col -->\n              </div>\n              <!-- /.row -->\n            </div>\n          </div>\n        </section>\n    </div>\n    <!-- /.row -->\n\n    <div class=\"row\">\n      <section class=\"col-lg-12\">\n        <div class=\"chart active\" id=\"monthlyApplicationsChart\" style=\"position: relative; height: 200px;\"></div>\n\n      </section>\n    </div>\n\n  </section>\n\n\n  <!-- /.content -->\n</div>"

/***/ }),

/***/ "../../../../../src/app/admin/admin-dashboard/admin-dashboard.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminDashboardComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_chart_js__ = __webpack_require__("../../../../chart.js/src/chart.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_chart_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_chart_js__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AdminDashboardComponent = (function () {
    function AdminDashboardComponent() {
    }
    AdminDashboardComponent.prototype.ngOnInit = function () {
        AdminLTE.init();
        this.monthlyApplicationsChart = Morris.Area({
            element: 'monthlyApplicationsChart',
            resize: true,
            data: [
                { m: '2018-01', item1: 2666, item2: 2666 },
                { m: '2018-02', item1: 2778, item2: 2294 },
                { m: '2018-03', item1: 4912, item2: 1969 },
                { m: '2018-04', item1: 3767, item2: 3597 },
                { m: '2018-05', item1: 6810, item2: 1914 },
                { m: '2018 06', item1: 5670, item2: 4293 }
            ],
            xkey: 'm',
            ykeys: ['item1', 'item2'],
            labels: ['Item 1', 'Item 2'],
            lineColors: ['red', 'blue'],
            hideHover: 'auto'
        });
        var deviceCtx = this.deviceUsageCanvas.nativeElement.getContext('2d');
        var data = {
            labels: [
                "Android",
                "iOS"
            ],
            datasets: [
                {
                    "data": [101342, 55342],
                    "backgroundColor": [
                        "#1bbc81",
                        "#4dc9f6"
                    ]
                }
            ]
        };
        var chart = new __WEBPACK_IMPORTED_MODULE_1_chart_js__["Chart"](deviceCtx, {
            "type": 'doughnut',
            "data": data,
            "options": {
                "cutoutPercentage": 50,
                "animation": {
                    "animateScale": true,
                    "animateRotate": false
                }
            }
        });
        var countryCtx = this.countryApplicationsCanvas.nativeElement.getContext('2d');
        var data = {
            labels: [
                "USA",
                "INDIA",
                "CANADA"
            ],
            datasets: [
                {
                    "data": [1200, 3000, 1810],
                    "backgroundColor": [
                        "#00ff22",
                        "#76a346",
                        "#537bc4"
                    ]
                }
            ]
        };
        var chart = new __WEBPACK_IMPORTED_MODULE_1_chart_js__["Chart"](countryCtx, {
            "type": 'doughnut',
            "data": data,
            "options": {
                "cutoutPercentage": 50,
                "animation": {
                    "animateScale": true,
                    "animateRotate": false
                }
            }
        });
        var data = {
            labels: [
                "14-25",
                "25-35",
                "35-45",
                "45-55",
                "55-65",
                "65-75",
                "75-85",
                "85-90"
            ],
            datasets: [
                {
                    "data": [1200, 200, 300, 100, 75, 89, 10, 3],
                    "backgroundColor": [
                        "#537bc4",
                        '#166a8f',
                        '#00a950',
                        '#58595b',
                        '#ff595b',
                        '#0059ff',
                        '#00ff22',
                        '#555555'
                    ]
                }
            ]
        };
        var ageGroupCtx = this.ageGroupCanvas.nativeElement.getContext('2d');
        var chart = new __WEBPACK_IMPORTED_MODULE_1_chart_js__["Chart"](ageGroupCtx, {
            "type": 'doughnut',
            "data": data,
            "options": {
                "cutoutPercentage": 50,
                "animation": {
                    "animateScale": true,
                    "animateRotate": false
                }
            }
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('deviceUsageCanvas'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], AdminDashboardComponent.prototype, "deviceUsageCanvas", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('countryApplicationsCanvas'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], AdminDashboardComponent.prototype, "countryApplicationsCanvas", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('ageGroupCanvas'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], AdminDashboardComponent.prototype, "ageGroupCanvas", void 0);
    AdminDashboardComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-admin-dashboard',
            template: __webpack_require__("../../../../../src/app/admin/admin-dashboard/admin-dashboard.component.html"),
            styles: [__webpack_require__("../../../../../src/app/admin/admin-dashboard/admin-dashboard.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], AdminDashboardComponent);
    return AdminDashboardComponent;
}());



/***/ }),

/***/ "../../../../../src/app/admin/admin-dashboard1/admin-dashboard1.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/admin/admin-dashboard1/admin-dashboard1.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"content-wrapper\">\n  <!-- Content Header (Page header) -->\n  <section class=\"content-header\">\n    <h1>\n      Dashboard\n      <small>Control panel</small>\n    </h1>\n    <ol class=\"breadcrumb\">\n      <li><a href=\"#\"><i class=\"fa fa-dashboard\"></i> Home</a></li>\n      <li class=\"active\">Dashboard</li>\n    </ol>\n  </section>\n\n  <!-- Main content -->\n  <section class=\"content\">\n    <!-- Small boxes (Stat box) -->\n    <div class=\"row\">\n      <div class=\"col-lg-3 col-xs-6\">\n        <!-- small box -->\n        <div class=\"small-box bg-aqua\">\n          <div class=\"inner\">\n            <h3>150</h3>\n\n            <p>New Orders</p>\n          </div>\n          <div class=\"icon\">\n            <i class=\"ion ion-bag\"></i>\n          </div>\n          <a href=\"#\" class=\"small-box-footer\">More info <i class=\"fa fa-arrow-circle-right\"></i></a>\n        </div>\n      </div>\n      <!-- ./col -->\n      <div class=\"col-lg-3 col-xs-6\">\n        <!-- small box -->\n        <div class=\"small-box bg-green\">\n          <div class=\"inner\">\n            <h3>53<sup style=\"font-size: 20px\">%</sup></h3>\n\n            <p>Bounce Rate</p>\n          </div>\n          <div class=\"icon\">\n            <i class=\"ion ion-stats-bars\"></i>\n          </div>\n          <a href=\"#\" class=\"small-box-footer\">More info <i class=\"fa fa-arrow-circle-right\"></i></a>\n        </div>\n      </div>\n      <!-- ./col -->\n      <div class=\"col-lg-3 col-xs-6\">\n        <!-- small box -->\n        <div class=\"small-box bg-yellow\">\n          <div class=\"inner\">\n            <h3>44</h3>\n\n            <p>User Registrations</p>\n          </div>\n          <div class=\"icon\">\n            <i class=\"ion ion-person-add\"></i>\n          </div>\n          <a href=\"#\" class=\"small-box-footer\">More info <i class=\"fa fa-arrow-circle-right\"></i></a>\n        </div>\n      </div>\n      <!-- ./col -->\n      <div class=\"col-lg-3 col-xs-6\">\n        <!-- small box -->\n        <div class=\"small-box bg-red\">\n          <div class=\"inner\">\n            <h3>65</h3>\n\n            <p>Unique Visitors</p>\n          </div>\n          <div class=\"icon\">\n            <i class=\"ion ion-pie-graph\"></i>\n          </div>\n          <a href=\"#\" class=\"small-box-footer\">More info <i class=\"fa fa-arrow-circle-right\"></i></a>\n        </div>\n      </div>\n      <!-- ./col -->\n    </div>\n    <!-- /.row -->\n    <!-- Main row -->\n    <div class=\"row\">\n      <!-- Left col -->\n      <section class=\"col-lg-7 connectedSortable\">\n        <!-- Custom tabs (Charts with tabs)-->\n        <div class=\"nav-tabs-custom\">\n          <!-- Tabs within a box -->\n          <ul class=\"nav nav-tabs pull-right\">\n            <li class=\"active\"><a href=\"#revenue-chart\" data-toggle=\"tab\">Area</a></li>\n            <li><a href=\"#sales-chart\" data-toggle=\"tab\">Donut</a></li>\n            <li class=\"pull-left header\"><i class=\"fa fa-inbox\"></i> Sales</li>\n          </ul>\n          <div class=\"tab-content no-padding\">\n            <!-- Morris chart - Sales -->\n            <div class=\"chart tab-pane active\" id=\"revenue-chart\" style=\"position: relative; height: 300px;\"></div>\n            <div class=\"chart tab-pane\" id=\"sales-chart\" style=\"position: relative; height: 300px;\"></div>\n          </div>\n        </div>\n        <!-- /.nav-tabs-custom -->\n\n        <!-- Chat box -->\n        <div class=\"box box-success\">\n          <div class=\"box-header\">\n            <i class=\"fa fa-comments-o\"></i>\n\n            <h3 class=\"box-title\">Chat</h3>\n\n            <div class=\"box-tools pull-right\" data-toggle=\"tooltip\" title=\"Status\">\n              <div class=\"btn-group\" data-toggle=\"btn-toggle\">\n                <button type=\"button\" class=\"btn btn-default btn-sm active\"><i class=\"fa fa-square text-green\"></i>\n                  </button>\n                <button type=\"button\" class=\"btn btn-default btn-sm\"><i class=\"fa fa-square text-red\"></i></button>\n              </div>\n            </div>\n          </div>\n          <div class=\"box-body chat\" id=\"chat-box\">\n            <!-- chat item -->\n            <div class=\"item\">\n              <img src=\"assets/img/user4-128x128.jpg\" alt=\"user image\" class=\"online\">\n\n              <p class=\"message\">\n                <a href=\"#\" class=\"name\">\n                    <small class=\"text-muted pull-right\"><i class=\"fa fa-clock-o\"></i> 2:15</small>\n                    Mike Doe\n                  </a> I would like to meet you to discuss the latest news about the arrival of the new theme.\n                They say it is going to be one the best themes on the market\n              </p>\n              <div class=\"attachment\">\n                <h4>Attachments:</h4>\n\n                <p class=\"filename\">\n                  Theme-thumbnail-image.jpg\n                </p>\n\n                <div class=\"pull-right\">\n                  <button type=\"button\" class=\"btn btn-primary btn-sm btn-flat\">Open</button>\n                </div>\n              </div>\n              <!-- /.attachment -->\n            </div>\n            <!-- /.item -->\n            <!-- chat item -->\n            <div class=\"item\">\n              <img src=\"assets/img/user3-128x128.jpg\" alt=\"user image\" class=\"offline\">\n\n              <p class=\"message\">\n                <a href=\"#\" class=\"name\">\n                    <small class=\"text-muted pull-right\"><i class=\"fa fa-clock-o\"></i> 5:15</small>\n                    Alexander Pierce\n                  </a> I would like to meet you to discuss the latest news about the arrival of the new theme.\n                They say it is going to be one the best themes on the market\n              </p>\n            </div>\n            <!-- /.item -->\n            <!-- chat item -->\n            <div class=\"item\">\n              <img src=\"assets/img/user2-160x160.jpg\" alt=\"user image\" class=\"offline\">\n\n              <p class=\"message\">\n                <a href=\"#\" class=\"name\">\n                    <small class=\"text-muted pull-right\"><i class=\"fa fa-clock-o\"></i> 5:30</small>\n                    Susan Doe\n                  </a> I would like to meet you to discuss the latest news about the arrival of the new theme.\n                They say it is going to be one the best themes on the market\n              </p>\n            </div>\n            <!-- /.item -->\n          </div>\n          <!-- /.chat -->\n          <div class=\"box-footer\">\n            <div class=\"input-group\">\n              <input class=\"form-control\" placeholder=\"Type message...\">\n\n              <div class=\"input-group-btn\">\n                <button type=\"button\" class=\"btn btn-success\"><i class=\"fa fa-plus\"></i></button>\n              </div>\n            </div>\n          </div>\n        </div>\n        <!-- /.box (chat box) -->\n\n        <!-- TO DO List -->\n        <div class=\"box box-primary\">\n          <div class=\"box-header\">\n            <i class=\"ion ion-clipboard\"></i>\n\n            <h3 class=\"box-title\">To Do List</h3>\n\n            <div class=\"box-tools pull-right\">\n              <ul class=\"pagination pagination-sm inline\">\n                <li><a href=\"#\">&laquo;</a></li>\n                <li><a href=\"#\">1</a></li>\n                <li><a href=\"#\">2</a></li>\n                <li><a href=\"#\">3</a></li>\n                <li><a href=\"#\">&raquo;</a></li>\n              </ul>\n            </div>\n          </div>\n          <!-- /.box-header -->\n          <div class=\"box-body\">\n            <ul class=\"todo-list\">\n              <li>\n                <!-- drag handle -->\n                <span class=\"handle\">\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                      </span>\n                <!-- checkbox -->\n                <input type=\"checkbox\" value=\"\">\n                <!-- todo text -->\n                <span class=\"text\">Design a nice theme</span>\n                <!-- Emphasis label -->\n                <small class=\"label label-danger\"><i class=\"fa fa-clock-o\"></i> 2 mins</small>\n                <!-- General tools such as edit or delete-->\n                <div class=\"tools\">\n                  <i class=\"fa fa-edit\"></i>\n                  <i class=\"fa fa-trash-o\"></i>\n                </div>\n              </li>\n              <li>\n                <span class=\"handle\">\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                      </span>\n                <input type=\"checkbox\" value=\"\">\n                <span class=\"text\">Make the theme responsive</span>\n                <small class=\"label label-info\"><i class=\"fa fa-clock-o\"></i> 4 hours</small>\n                <div class=\"tools\">\n                  <i class=\"fa fa-edit\"></i>\n                  <i class=\"fa fa-trash-o\"></i>\n                </div>\n              </li>\n              <li>\n                <span class=\"handle\">\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                      </span>\n                <input type=\"checkbox\" value=\"\">\n                <span class=\"text\">Let theme shine like a star</span>\n                <small class=\"label label-warning\"><i class=\"fa fa-clock-o\"></i> 1 day</small>\n                <div class=\"tools\">\n                  <i class=\"fa fa-edit\"></i>\n                  <i class=\"fa fa-trash-o\"></i>\n                </div>\n              </li>\n              <li>\n                <span class=\"handle\">\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                      </span>\n                <input type=\"checkbox\" value=\"\">\n                <span class=\"text\">Let theme shine like a star</span>\n                <small class=\"label label-success\"><i class=\"fa fa-clock-o\"></i> 3 days</small>\n                <div class=\"tools\">\n                  <i class=\"fa fa-edit\"></i>\n                  <i class=\"fa fa-trash-o\"></i>\n                </div>\n              </li>\n              <li>\n                <span class=\"handle\">\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                      </span>\n                <input type=\"checkbox\" value=\"\">\n                <span class=\"text\">Check your messages and notifications</span>\n                <small class=\"label label-primary\"><i class=\"fa fa-clock-o\"></i> 1 week</small>\n                <div class=\"tools\">\n                  <i class=\"fa fa-edit\"></i>\n                  <i class=\"fa fa-trash-o\"></i>\n                </div>\n              </li>\n              <li>\n                <span class=\"handle\">\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                        <i class=\"fa fa-ellipsis-v\"></i>\n                      </span>\n                <input type=\"checkbox\" value=\"\">\n                <span class=\"text\">Let theme shine like a star</span>\n                <small class=\"label label-default\"><i class=\"fa fa-clock-o\"></i> 1 month</small>\n                <div class=\"tools\">\n                  <i class=\"fa fa-edit\"></i>\n                  <i class=\"fa fa-trash-o\"></i>\n                </div>\n              </li>\n            </ul>\n          </div>\n          <!-- /.box-body -->\n          <div class=\"box-footer clearfix no-border\">\n            <button type=\"button\" class=\"btn btn-default pull-right\"><i class=\"fa fa-plus\"></i> Add item</button>\n          </div>\n        </div>\n        <!-- /.box -->\n\n        <!-- quick email widget -->\n        <div class=\"box box-info\">\n          <div class=\"box-header\">\n            <i class=\"fa fa-envelope\"></i>\n\n            <h3 class=\"box-title\">Quick Email</h3>\n            <!-- tools box -->\n            <div class=\"pull-right box-tools\">\n              <button type=\"button\" class=\"btn btn-info btn-sm\" data-widget=\"remove\" data-toggle=\"tooltip\" title=\"Remove\">\n                  <i class=\"fa fa-times\"></i></button>\n            </div>\n            <!-- /. tools -->\n          </div>\n          <div class=\"box-body\">\n            <form action=\"#\" method=\"post\">\n              <div class=\"form-group\">\n                <input type=\"email\" class=\"form-control\" name=\"emailto\" placeholder=\"Email to:\">\n              </div>\n              <div class=\"form-group\">\n                <input type=\"text\" class=\"form-control\" name=\"subject\" placeholder=\"Subject\">\n              </div>\n              <div>\n                <textarea class=\"textarea\" placeholder=\"Message\" style=\"width: 100%; height: 125px; font-size: 14px; line-height: 18px; border: 1px solid #dddddd; padding: 10px;\"></textarea>\n              </div>\n            </form>\n          </div>\n          <div class=\"box-footer clearfix\">\n            <button type=\"button\" class=\"pull-right btn btn-default\" id=\"sendEmail\">Send\n                <i class=\"fa fa-arrow-circle-right\"></i></button>\n          </div>\n        </div>\n\n      </section>\n      <!-- /.Left col -->\n      <!-- right col (We are only adding the ID to make the widgets sortable)-->\n      <section class=\"col-lg-5 connectedSortable\">\n\n        <!-- Map box -->\n        <div class=\"box box-solid bg-light-blue-gradient\">\n          <div class=\"box-header\">\n            <!-- tools box -->\n            <div class=\"pull-right box-tools\">\n              <button type=\"button\" class=\"btn btn-primary btn-sm daterange pull-right\" data-toggle=\"tooltip\" title=\"Date range\">\n                  <i class=\"fa fa-calendar\"></i></button>\n              <button type=\"button\" class=\"btn btn-primary btn-sm pull-right\" data-widget=\"collapse\" data-toggle=\"tooltip\" title=\"Collapse\"\n                style=\"margin-right: 5px;\">\n                  <i class=\"fa fa-minus\"></i></button>\n            </div>\n            <!-- /. tools -->\n\n            <i class=\"fa fa-map-marker\"></i>\n\n            <h3 class=\"box-title\">\n              Visitors\n            </h3>\n          </div>\n          <div class=\"box-body\">\n            <div id=\"world-map\" style=\"height: 250px; width: 100%;\"></div>\n          </div>\n          <!-- /.box-body-->\n          <div class=\"box-footer no-border\">\n            <div class=\"row\">\n              <div class=\"col-xs-4 text-center\" style=\"border-right: 1px solid #f4f4f4\">\n                <div id=\"sparkline-1\"></div>\n                <div class=\"knob-label\">Visitors</div>\n              </div>\n              <!-- ./col -->\n              <div class=\"col-xs-4 text-center\" style=\"border-right: 1px solid #f4f4f4\">\n                <div id=\"sparkline-2\"></div>\n                <div class=\"knob-label\">Online</div>\n              </div>\n              <!-- ./col -->\n              <div class=\"col-xs-4 text-center\">\n                <div id=\"sparkline-3\"></div>\n                <div class=\"knob-label\">Exists</div>\n              </div>\n              <!-- ./col -->\n            </div>\n            <!-- /.row -->\n          </div>\n        </div>\n        <!-- /.box -->\n\n        <!-- solid sales graph -->\n        <div class=\"box box-solid bg-teal-gradient\">\n          <div class=\"box-header\">\n            <i class=\"fa fa-th\"></i>\n\n            <h3 class=\"box-title\">Sales Graph</h3>\n\n            <div class=\"box-tools pull-right\">\n              <button type=\"button\" class=\"btn bg-teal btn-sm\" data-widget=\"collapse\"><i class=\"fa fa-minus\"></i>\n                </button>\n              <button type=\"button\" class=\"btn bg-teal btn-sm\" data-widget=\"remove\"><i class=\"fa fa-times\"></i>\n                </button>\n            </div>\n          </div>\n          <div class=\"box-body border-radius-none\">\n            <div class=\"chart\" id=\"line-chart\" style=\"height: 250px;\"></div>\n          </div>\n          <!-- /.box-body -->\n          <div class=\"box-footer no-border\">\n            <div class=\"row\">\n              <div class=\"col-xs-4 text-center\" style=\"border-right: 1px solid #f4f4f4\">\n                <input type=\"text\" class=\"knob\" data-readonly=\"true\" value=\"20\" data-width=\"60\" data-height=\"60\" data-fgColor=\"#39CCCC\">\n\n                <div class=\"knob-label\">Mail-Orders</div>\n              </div>\n              <!-- ./col -->\n              <div class=\"col-xs-4 text-center\" style=\"border-right: 1px solid #f4f4f4\">\n                <input type=\"text\" class=\"knob\" data-readonly=\"true\" value=\"50\" data-width=\"60\" data-height=\"60\" data-fgColor=\"#39CCCC\">\n\n                <div class=\"knob-label\">Online</div>\n              </div>\n              <!-- ./col -->\n              <div class=\"col-xs-4 text-center\">\n                <input type=\"text\" class=\"knob\" data-readonly=\"true\" value=\"30\" data-width=\"60\" data-height=\"60\" data-fgColor=\"#39CCCC\">\n\n                <div class=\"knob-label\">In-Store</div>\n              </div>\n              <!-- ./col -->\n            </div>\n            <!-- /.row -->\n          </div>\n          <!-- /.box-footer -->\n        </div>\n        <!-- /.box -->\n\n        <!-- Calendar -->\n        <div class=\"box box-solid bg-green-gradient\">\n          <div class=\"box-header\">\n            <i class=\"fa fa-calendar\"></i>\n\n            <h3 class=\"box-title\">Calendar</h3>\n            <!-- tools box -->\n            <div class=\"pull-right box-tools\">\n              <!-- button with a dropdown -->\n              <div class=\"btn-group\">\n                <button type=\"button\" class=\"btn btn-success btn-sm dropdown-toggle\" data-toggle=\"dropdown\">\n                    <i class=\"fa fa-bars\"></i></button>\n                <ul class=\"dropdown-menu pull-right\" role=\"menu\">\n                  <li><a href=\"#\">Add new event</a></li>\n                  <li><a href=\"#\">Clear events</a></li>\n                  <li class=\"divider\"></li>\n                  <li><a href=\"#\">View calendar</a></li>\n                </ul>\n              </div>\n              <button type=\"button\" class=\"btn btn-success btn-sm\" data-widget=\"collapse\"><i class=\"fa fa-minus\"></i>\n                </button>\n              <button type=\"button\" class=\"btn btn-success btn-sm\" data-widget=\"remove\"><i class=\"fa fa-times\"></i>\n                </button>\n            </div>\n            <!-- /. tools -->\n          </div>\n          <!-- /.box-header -->\n          <div class=\"box-body no-padding\">\n            <!--The calendar -->\n            <div id=\"calendar\" style=\"width: 100%\"></div>\n          </div>\n          <!-- /.box-body -->\n          <div class=\"box-footer text-black\">\n            <div class=\"row\">\n              <div class=\"col-sm-6\">\n                <!-- Progress bars -->\n                <div class=\"clearfix\">\n                  <span class=\"pull-left\">Task #1</span>\n                  <small class=\"pull-right\">90%</small>\n                </div>\n                <div class=\"progress xs\">\n                  <div class=\"progress-bar progress-bar-green\" style=\"width: 90%;\"></div>\n                </div>\n\n                <div class=\"clearfix\">\n                  <span class=\"pull-left\">Task #2</span>\n                  <small class=\"pull-right\">70%</small>\n                </div>\n                <div class=\"progress xs\">\n                  <div class=\"progress-bar progress-bar-green\" style=\"width: 70%;\"></div>\n                </div>\n              </div>\n              <!-- /.col -->\n              <div class=\"col-sm-6\">\n                <div class=\"clearfix\">\n                  <span class=\"pull-left\">Task #3</span>\n                  <small class=\"pull-right\">60%</small>\n                </div>\n                <div class=\"progress xs\">\n                  <div class=\"progress-bar progress-bar-green\" style=\"width: 60%;\"></div>\n                </div>\n\n                <div class=\"clearfix\">\n                  <span class=\"pull-left\">Task #4</span>\n                  <small class=\"pull-right\">40%</small>\n                </div>\n                <div class=\"progress xs\">\n                  <div class=\"progress-bar progress-bar-green\" style=\"width: 40%;\"></div>\n                </div>\n              </div>\n              <!-- /.col -->\n            </div>\n            <!-- /.row -->\n          </div>\n        </div>\n        <!-- /.box -->\n\n      </section>\n      <!-- right col -->\n    </div>\n    <!-- /.row (main row) -->\n\n  </section>\n  <!-- /.content -->\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/admin/admin-dashboard1/admin-dashboard1.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminDashboard1Component; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment__ = __webpack_require__("../../../../moment/moment.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_moment__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AdminDashboard1Component = (function () {
    function AdminDashboard1Component() {
    }
    AdminDashboard1Component.prototype.ngOnInit = function () {
        // Update the AdminLTE layouts
        AdminLTE.init();
        // Make the dashboard widgets sortable Using jquery UI
        jQuery('.connectedSortable').sortable({
            placeholder: 'sort-highlight',
            connectWith: '.connectedSortable',
            handle: '.box-header, .nav-tabs',
            forcePlaceholderSize: true,
            zIndex: 999999
        });
        jQuery('.connectedSortable .box-header, .connectedSortable .nav-tabs-custom').css('cursor', 'move');
        // jQuery UI sortable for the todo list
        jQuery('.todo-list').sortable({
            placeholder: 'sort-highlight',
            handle: '.handle',
            forcePlaceholderSize: true,
            zIndex: 999999
        });
        // bootstrap WYSIHTML5 - text editor
        // jQuery('.textarea').wysihtml5();
        jQuery('.daterange').daterangepicker({
            ranges: {
                'Today': [__WEBPACK_IMPORTED_MODULE_1_moment__(), __WEBPACK_IMPORTED_MODULE_1_moment__()],
                'Yesterday': [__WEBPACK_IMPORTED_MODULE_1_moment__().subtract(1, 'days'), __WEBPACK_IMPORTED_MODULE_1_moment__().subtract(1, 'days')],
                'Last 7 Days': [__WEBPACK_IMPORTED_MODULE_1_moment__().subtract(6, 'days'), __WEBPACK_IMPORTED_MODULE_1_moment__()],
                'Last 30 Days': [__WEBPACK_IMPORTED_MODULE_1_moment__().subtract(29, 'days'), __WEBPACK_IMPORTED_MODULE_1_moment__()],
                'This Month': [__WEBPACK_IMPORTED_MODULE_1_moment__().startOf('month'), __WEBPACK_IMPORTED_MODULE_1_moment__().endOf('month')],
                'Last Month': [__WEBPACK_IMPORTED_MODULE_1_moment__().subtract(1, 'month').startOf('month'), __WEBPACK_IMPORTED_MODULE_1_moment__().subtract(1, 'month').endOf('month')]
            },
            startDate: __WEBPACK_IMPORTED_MODULE_1_moment__().subtract(29, 'days'),
            endDate: __WEBPACK_IMPORTED_MODULE_1_moment__()
        }, function (start, end) {
            // window.alert('You chose:  ' + this.start.format('MMMM D, YYYY') + ' - ' + this.end.format('MMMM D, YYYY'));
        });
        this.knob = jQuery('.knob').knob();
        this.calendar = jQuery('#calendar').datepicker();
        // SLIMSCROLL FOR CHAT WIDGET
        jQuery('#chat-box').slimScroll({
            height: '250px'
        });
        this.areaChart = Morris.Area({
            element: 'revenue-chart',
            resize: true,
            data: [
                { y: '2011 Q1', item1: 2666, item2: 2666 },
                { y: '2011 Q2', item1: 2778, item2: 2294 },
                { y: '2011 Q3', item1: 4912, item2: 1969 },
                { y: '2011 Q4', item1: 3767, item2: 3597 },
                { y: '2012 Q1', item1: 6810, item2: 1914 },
                { y: '2012 Q2', item1: 5670, item2: 4293 },
                { y: '2012 Q3', item1: 4820, item2: 3795 },
                { y: '2012 Q4', item1: 15073, item2: 5967 },
                { y: '2013 Q1', item1: 10687, item2: 4460 },
                { y: '2013 Q2', item1: 8432, item2: 5713 }
            ],
            xkey: 'y',
            ykeys: ['item1', 'item2'],
            labels: ['Item 1', 'Item 2'],
            lineColors: ['#a0d0e0', '#3c8dbc'],
            hideHover: 'auto'
        });
        this.donutChart = Morris.Donut({
            element: 'sales-chart',
            resize: true,
            colors: ['#3c8dbc', '#f56954', '#00a65a'],
            data: [
                { label: 'Download Sales', value: 12 },
                { label: 'In-Store Sales', value: 30 },
                { label: 'Mail-Order Sales', value: 20 }
            ],
        });
        this.linechart = Morris.Line({
            element: 'line-chart',
            resize: true,
            data: [
                { y: '2011 Q1', item1: 2666 },
                { y: '2011 Q2', item1: 2778 },
                { y: '2011 Q3', item1: 4912 },
                { y: '2011 Q4', item1: 3767 },
                { y: '2012 Q1', item1: 6810 },
                { y: '2012 Q2', item1: 5670 },
                { y: '2012 Q3', item1: 4820 },
                { y: '2012 Q4', item1: 15073 },
                { y: '2013 Q1', item1: 10687 },
                { y: '2013 Q2', item1: 8432 }
            ],
            xkey: 'y',
            ykeys: ['item1'],
            labels: ['Item 1'],
            lineColors: ['#efefef'],
            lineWidth: 2,
            hideHover: 'auto',
            gridTextColor: '#fff',
            gridStrokeWidth: 0.4,
            pointSize: 4,
            pointStrokeColors: ['#efefef'],
            gridLineColor: '#efefef',
            gridTextFamily: 'Open Sans',
            gridTextSize: 10
        });
        /* The todo list plugin */
        /*
        jQuery('.todo-list').todolist({
          onCheck: function (ele) {
            window.console.log('The element has been checked');
            return ele;
          },
          onUncheck: function (ele) {
            window.console.log('The element has been unchecked');
            return ele;
          }
        });*/
    };
    AdminDashboard1Component = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-admin-dashboard1',
            template: __webpack_require__("../../../../../src/app/admin/admin-dashboard1/admin-dashboard1.component.html"),
            styles: [__webpack_require__("../../../../../src/app/admin/admin-dashboard1/admin-dashboard1.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], AdminDashboard1Component);
    return AdminDashboard1Component;
}());



/***/ }),

/***/ "../../../../../src/app/admin/admin-dashboard2/admin-dashboard2.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/admin/admin-dashboard2/admin-dashboard2.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"content-wrapper\">\n  <!-- Content Header (Page header) -->\n  <section class=\"content-header\">\n    <h1>\n      Dashboard\n      <small>Version 2.0</small>\n    </h1>\n    <ol class=\"breadcrumb\">\n      <li><a href=\"#\"><i class=\"fa fa-dashboard\"></i> Home</a></li>\n      <li class=\"active\">Dashboard</li>\n    </ol>\n  </section>\n\n  <!-- Main content -->\n  <section class=\"content\">\n    <!-- Info boxes -->\n    <div class=\"row\">\n      <div class=\"col-md-3 col-sm-6 col-xs-12\">\n        <div class=\"info-box\">\n          <span class=\"info-box-icon bg-aqua\"><i class=\"ion ion-ios-gear-outline\"></i></span>\n\n          <div class=\"info-box-content\">\n            <span class=\"info-box-text\">CPU Traffic</span>\n            <span class=\"info-box-number\">90<small>%</small></span>\n          </div>\n          <!-- /.info-box-content -->\n        </div>\n        <!-- /.info-box -->\n      </div>\n      <!-- /.col -->\n      <div class=\"col-md-3 col-sm-6 col-xs-12\">\n        <div class=\"info-box\">\n          <span class=\"info-box-icon bg-red\"><i class=\"fa fa-google-plus\"></i></span>\n\n          <div class=\"info-box-content\">\n            <span class=\"info-box-text\">Likes</span>\n            <span class=\"info-box-number\">41,410</span>\n          </div>\n          <!-- /.info-box-content -->\n        </div>\n        <!-- /.info-box -->\n      </div>\n      <!-- /.col -->\n\n      <!-- fix for small devices only -->\n      <div class=\"clearfix visible-sm-block\"></div>\n\n      <div class=\"col-md-3 col-sm-6 col-xs-12\">\n        <div class=\"info-box\">\n          <span class=\"info-box-icon bg-green\"><i class=\"ion ion-ios-cart-outline\"></i></span>\n\n          <div class=\"info-box-content\">\n            <span class=\"info-box-text\">Sales</span>\n            <span class=\"info-box-number\">760</span>\n          </div>\n          <!-- /.info-box-content -->\n        </div>\n        <!-- /.info-box -->\n      </div>\n      <!-- /.col -->\n      <div class=\"col-md-3 col-sm-6 col-xs-12\">\n        <div class=\"info-box\">\n          <span class=\"info-box-icon bg-yellow\"><i class=\"ion ion-ios-people-outline\"></i></span>\n\n          <div class=\"info-box-content\">\n            <span class=\"info-box-text\">New Members</span>\n            <span class=\"info-box-number\">2,000</span>\n          </div>\n          <!-- /.info-box-content -->\n        </div>\n        <!-- /.info-box -->\n      </div>\n      <!-- /.col -->\n    </div>\n    <!-- /.row -->\n\n    <div class=\"row\">\n      <div class=\"col-md-12\">\n        <div class=\"box\">\n          <div class=\"box-header with-border\">\n            <h3 class=\"box-title\">Monthly Recap Report</h3>\n\n            <div class=\"box-tools pull-right\">\n              <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"collapse\"><i class=\"fa fa-minus\"></i>\n                </button>\n              <div class=\"btn-group\">\n                <button type=\"button\" class=\"btn btn-box-tool dropdown-toggle\" data-toggle=\"dropdown\">\n                    <i class=\"fa fa-wrench\"></i></button>\n                <ul class=\"dropdown-menu\" role=\"menu\">\n                  <li><a href=\"#\">Action</a></li>\n                  <li><a href=\"#\">Another action</a></li>\n                  <li><a href=\"#\">Something else here</a></li>\n                  <li class=\"divider\"></li>\n                  <li><a href=\"#\">Separated link</a></li>\n                </ul>\n              </div>\n              <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"remove\"><i class=\"fa fa-times\"></i></button>\n            </div>\n          </div>\n          <!-- /.box-header -->\n          <div class=\"box-body\">\n            <div class=\"row\">\n              <div class=\"col-md-8\">\n                <p class=\"text-center\">\n                  <strong>Sales: 1 Jan, 2014 - 30 Jul, 2014</strong>\n                </p>\n\n                <div class=\"chart\">\n                  <!-- Sales Chart Canvas -->\n                  <canvas id=\"salesChart\" style=\"height: 180px;\"></canvas>\n                </div>\n                <!-- /.chart-responsive -->\n              </div>\n              <!-- /.col -->\n              <div class=\"col-md-4\">\n                <p class=\"text-center\">\n                  <strong>Goal Completion</strong>\n                </p>\n\n                <div class=\"progress-group\">\n                  <span class=\"progress-text\">Add Products to Cart</span>\n                  <span class=\"progress-number\"><b>160</b>/200</span>\n\n                  <div class=\"progress sm\">\n                    <div class=\"progress-bar progress-bar-aqua\" style=\"width: 80%\"></div>\n                  </div>\n                </div>\n                <!-- /.progress-group -->\n                <div class=\"progress-group\">\n                  <span class=\"progress-text\">Complete Purchase</span>\n                  <span class=\"progress-number\"><b>310</b>/400</span>\n\n                  <div class=\"progress sm\">\n                    <div class=\"progress-bar progress-bar-red\" style=\"width: 80%\"></div>\n                  </div>\n                </div>\n                <!-- /.progress-group -->\n                <div class=\"progress-group\">\n                  <span class=\"progress-text\">Visit Premium Page</span>\n                  <span class=\"progress-number\"><b>480</b>/800</span>\n\n                  <div class=\"progress sm\">\n                    <div class=\"progress-bar progress-bar-green\" style=\"width: 80%\"></div>\n                  </div>\n                </div>\n                <!-- /.progress-group -->\n                <div class=\"progress-group\">\n                  <span class=\"progress-text\">Send Inquiries</span>\n                  <span class=\"progress-number\"><b>250</b>/500</span>\n\n                  <div class=\"progress sm\">\n                    <div class=\"progress-bar progress-bar-yellow\" style=\"width: 80%\"></div>\n                  </div>\n                </div>\n                <!-- /.progress-group -->\n              </div>\n              <!-- /.col -->\n            </div>\n            <!-- /.row -->\n          </div>\n          <!-- ./box-body -->\n          <div class=\"box-footer\">\n            <div class=\"row\">\n              <div class=\"col-sm-3 col-xs-6\">\n                <div class=\"description-block border-right\">\n                  <span class=\"description-percentage text-green\"><i class=\"fa fa-caret-up\"></i> 17%</span>\n                  <h5 class=\"description-header\">$35,210.43</h5>\n                  <span class=\"description-text\">TOTAL REVENUE</span>\n                </div>\n                <!-- /.description-block -->\n              </div>\n              <!-- /.col -->\n              <div class=\"col-sm-3 col-xs-6\">\n                <div class=\"description-block border-right\">\n                  <span class=\"description-percentage text-yellow\"><i class=\"fa fa-caret-left\"></i> 0%</span>\n                  <h5 class=\"description-header\">$10,390.90</h5>\n                  <span class=\"description-text\">TOTAL COST</span>\n                </div>\n                <!-- /.description-block -->\n              </div>\n              <!-- /.col -->\n              <div class=\"col-sm-3 col-xs-6\">\n                <div class=\"description-block border-right\">\n                  <span class=\"description-percentage text-green\"><i class=\"fa fa-caret-up\"></i> 20%</span>\n                  <h5 class=\"description-header\">$24,813.53</h5>\n                  <span class=\"description-text\">TOTAL PROFIT</span>\n                </div>\n                <!-- /.description-block -->\n              </div>\n              <!-- /.col -->\n              <div class=\"col-sm-3 col-xs-6\">\n                <div class=\"description-block\">\n                  <span class=\"description-percentage text-red\"><i class=\"fa fa-caret-down\"></i> 18%</span>\n                  <h5 class=\"description-header\">1200</h5>\n                  <span class=\"description-text\">GOAL COMPLETIONS</span>\n                </div>\n                <!-- /.description-block -->\n              </div>\n            </div>\n            <!-- /.row -->\n          </div>\n          <!-- /.box-footer -->\n        </div>\n        <!-- /.box -->\n      </div>\n      <!-- /.col -->\n    </div>\n    <!-- /.row -->\n\n    <!-- Main row -->\n    <div class=\"row\">\n      <!-- Left col -->\n      <div class=\"col-md-8\">\n        <!-- MAP & BOX PANE -->\n        <div class=\"box box-success\">\n          <div class=\"box-header with-border\">\n            <h3 class=\"box-title\">Visitors Report</h3>\n\n            <div class=\"box-tools pull-right\">\n              <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"collapse\"><i class=\"fa fa-minus\"></i>\n                </button>\n              <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"remove\"><i class=\"fa fa-times\"></i></button>\n            </div>\n          </div>\n          <!-- /.box-header -->\n          <div class=\"box-body no-padding\">\n            <div class=\"row\">\n              <div class=\"col-md-9 col-sm-8\">\n                <div class=\"pad\">\n                  <!-- Map will be created here -->\n                  <div id=\"world-map-markers\" style=\"height: 325px;\"></div>\n                </div>\n              </div>\n              <!-- /.col -->\n              <div class=\"col-md-3 col-sm-4\">\n                <div class=\"pad box-pane-right bg-green\" style=\"min-height: 280px\">\n                  <div class=\"description-block margin-bottom\">\n                    <div class=\"sparkbar pad\" data-color=\"#fff\">90,70,90,70,75,80,70</div>\n                    <h5 class=\"description-header\">8390</h5>\n                    <span class=\"description-text\">Visits</span>\n                  </div>\n                  <!-- /.description-block -->\n                  <div class=\"description-block margin-bottom\">\n                    <div class=\"sparkbar pad\" data-color=\"#fff\">90,50,90,70,61,83,63</div>\n                    <h5 class=\"description-header\">30%</h5>\n                    <span class=\"description-text\">Referrals</span>\n                  </div>\n                  <!-- /.description-block -->\n                  <div class=\"description-block\">\n                    <div class=\"sparkbar pad\" data-color=\"#fff\">90,50,90,70,61,83,63</div>\n                    <h5 class=\"description-header\">70%</h5>\n                    <span class=\"description-text\">Organic</span>\n                  </div>\n                  <!-- /.description-block -->\n                </div>\n              </div>\n              <!-- /.col -->\n            </div>\n            <!-- /.row -->\n          </div>\n          <!-- /.box-body -->\n        </div>\n        <!-- /.box -->\n        <div class=\"row\">\n          <div class=\"col-md-6\">\n            <!-- DIRECT CHAT -->\n            <div class=\"box box-warning direct-chat direct-chat-warning\">\n              <div class=\"box-header with-border\">\n                <h3 class=\"box-title\">Direct Chat</h3>\n\n                <div class=\"box-tools pull-right\">\n                  <span data-toggle=\"tooltip\" title=\"3 New Messages\" class=\"badge bg-yellow\">3</span>\n                  <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"collapse\"><i class=\"fa fa-minus\"></i>\n                    </button>\n                  <button type=\"button\" class=\"btn btn-box-tool\" data-toggle=\"tooltip\" title=\"Contacts\" data-widget=\"chat-pane-toggle\">\n                      <i class=\"fa fa-comments\"></i></button>\n                  <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"remove\"><i class=\"fa fa-times\"></i>\n                    </button>\n                </div>\n              </div>\n              <!-- /.box-header -->\n              <div class=\"box-body\">\n                <!-- Conversations are loaded here -->\n                <div class=\"direct-chat-messages\">\n                  <!-- Message. Default to the left -->\n                  <div class=\"direct-chat-msg\">\n                    <div class=\"direct-chat-info clearfix\">\n                      <span class=\"direct-chat-name pull-left\">Alexander Pierce</span>\n                      <span class=\"direct-chat-timestamp pull-right\">23 Jan 2:00 pm</span>\n                    </div>\n                    <!-- /.direct-chat-info -->\n                    <img class=\"direct-chat-img\" src=\"assets/img/user1-128x128.jpg\" alt=\"message user image\">\n                    <!-- /.direct-chat-img -->\n                    <div class=\"direct-chat-text\">\n                      Is this template really for free? That's unbelievable!\n                    </div>\n                    <!-- /.direct-chat-text -->\n                  </div>\n                  <!-- /.direct-chat-msg -->\n\n                  <!-- Message to the right -->\n                  <div class=\"direct-chat-msg right\">\n                    <div class=\"direct-chat-info clearfix\">\n                      <span class=\"direct-chat-name pull-right\">Sarah Bullock</span>\n                      <span class=\"direct-chat-timestamp pull-left\">23 Jan 2:05 pm</span>\n                    </div>\n                    <!-- /.direct-chat-info -->\n                    <img class=\"direct-chat-img\" src=\"assets/img/user3-128x128.jpg\" alt=\"message user image\">\n                    <!-- /.direct-chat-img -->\n                    <div class=\"direct-chat-text\">\n                      You better believe it!\n                    </div>\n                    <!-- /.direct-chat-text -->\n                  </div>\n                  <!-- /.direct-chat-msg -->\n\n                  <!-- Message. Default to the left -->\n                  <div class=\"direct-chat-msg\">\n                    <div class=\"direct-chat-info clearfix\">\n                      <span class=\"direct-chat-name pull-left\">Alexander Pierce</span>\n                      <span class=\"direct-chat-timestamp pull-right\">23 Jan 5:37 pm</span>\n                    </div>\n                    <!-- /.direct-chat-info -->\n                    <img class=\"direct-chat-img\" src=\"assets/img/user1-128x128.jpg\" alt=\"message user image\">\n                    <!-- /.direct-chat-img -->\n                    <div class=\"direct-chat-text\">\n                      Working with AdminLTE on a great new app! Wanna join?\n                    </div>\n                    <!-- /.direct-chat-text -->\n                  </div>\n                  <!-- /.direct-chat-msg -->\n\n                  <!-- Message to the right -->\n                  <div class=\"direct-chat-msg right\">\n                    <div class=\"direct-chat-info clearfix\">\n                      <span class=\"direct-chat-name pull-right\">Sarah Bullock</span>\n                      <span class=\"direct-chat-timestamp pull-left\">23 Jan 6:10 pm</span>\n                    </div>\n                    <!-- /.direct-chat-info -->\n                    <img class=\"direct-chat-img\" src=\"assets/img/user3-128x128.jpg\" alt=\"message user image\">\n                    <!-- /.direct-chat-img -->\n                    <div class=\"direct-chat-text\">\n                      I would love to.\n                    </div>\n                    <!-- /.direct-chat-text -->\n                  </div>\n                  <!-- /.direct-chat-msg -->\n\n                </div>\n                <!--/.direct-chat-messages-->\n\n                <!-- Contacts are loaded here -->\n                <div class=\"direct-chat-contacts\">\n                  <ul class=\"contacts-list\">\n                    <li>\n                      <a href=\"#\">\n                          <img class=\"contacts-list-img\" src=\"assets/img/user1-128x128.jpg\" alt=\"User Image\">\n\n                          <div class=\"contacts-list-info\">\n                                <span class=\"contacts-list-name\">\n                                  Count Dracula\n                                  <small class=\"contacts-list-date pull-right\">2/28/2015</small>\n                                </span>\n                            <span class=\"contacts-list-msg\">How have you been? I was...</span>\n                          </div>\n                          <!-- /.contacts-list-info -->\n                        </a>\n                    </li>\n                    <!-- End Contact Item -->\n                    <li>\n                      <a href=\"#\">\n                          <img class=\"contacts-list-img\" src=\"assets/img/user7-128x128.jpg\" alt=\"User Image\">\n\n                          <div class=\"contacts-list-info\">\n                                <span class=\"contacts-list-name\">\n                                  Sarah Doe\n                                  <small class=\"contacts-list-date pull-right\">2/23/2015</small>\n                                </span>\n                            <span class=\"contacts-list-msg\">I will be waiting for...</span>\n                          </div>\n                          <!-- /.contacts-list-info -->\n                        </a>\n                    </li>\n                    <!-- End Contact Item -->\n                    <li>\n                      <a href=\"#\">\n                          <img class=\"contacts-list-img\" src=\"assets/img/user3-128x128.jpg\" alt=\"User Image\">\n\n                          <div class=\"contacts-list-info\">\n                                <span class=\"contacts-list-name\">\n                                  Nadia Jolie\n                                  <small class=\"contacts-list-date pull-right\">2/20/2015</small>\n                                </span>\n                            <span class=\"contacts-list-msg\">I'll call you back at...</span>\n                          </div>\n                          <!-- /.contacts-list-info -->\n                        </a>\n                    </li>\n                    <!-- End Contact Item -->\n                    <li>\n                      <a href=\"#\">\n                          <img class=\"contacts-list-img\" src=\"assets/img/user5-128x128.jpg\" alt=\"User Image\">\n\n                          <div class=\"contacts-list-info\">\n                                <span class=\"contacts-list-name\">\n                                  Nora S. Vans\n                                  <small class=\"contacts-list-date pull-right\">2/10/2015</small>\n                                </span>\n                            <span class=\"contacts-list-msg\">Where is your new...</span>\n                          </div>\n                          <!-- /.contacts-list-info -->\n                        </a>\n                    </li>\n                    <!-- End Contact Item -->\n                    <li>\n                      <a href=\"#\">\n                          <img class=\"contacts-list-img\" src=\"assets/img/user6-128x128.jpg\" alt=\"User Image\">\n\n                          <div class=\"contacts-list-info\">\n                                <span class=\"contacts-list-name\">\n                                  John K.\n                                  <small class=\"contacts-list-date pull-right\">1/27/2015</small>\n                                </span>\n                            <span class=\"contacts-list-msg\">Can I take a look at...</span>\n                          </div>\n                          <!-- /.contacts-list-info -->\n                        </a>\n                    </li>\n                    <!-- End Contact Item -->\n                    <li>\n                      <a href=\"#\">\n                          <img class=\"contacts-list-img\" src=\"assets/img/user8-128x128.jpg\" alt=\"User Image\">\n\n                          <div class=\"contacts-list-info\">\n                                <span class=\"contacts-list-name\">\n                                  Kenneth M.\n                                  <small class=\"contacts-list-date pull-right\">1/4/2015</small>\n                                </span>\n                            <span class=\"contacts-list-msg\">Never mind I found...</span>\n                          </div>\n                          <!-- /.contacts-list-info -->\n                        </a>\n                    </li>\n                    <!-- End Contact Item -->\n                  </ul>\n                  <!-- /.contatcts-list -->\n                </div>\n                <!-- /.direct-chat-pane -->\n              </div>\n              <!-- /.box-body -->\n              <div class=\"box-footer\">\n                <form action=\"#\" method=\"post\">\n                  <div class=\"input-group\">\n                    <input type=\"text\" name=\"message\" placeholder=\"Type Message ...\" class=\"form-control\">\n                    <span class=\"input-group-btn\">\n                            <button type=\"button\" class=\"btn btn-warning btn-flat\">Send</button>\n                          </span>\n                  </div>\n                </form>\n              </div>\n              <!-- /.box-footer-->\n            </div>\n            <!--/.direct-chat -->\n          </div>\n          <!-- /.col -->\n\n          <div class=\"col-md-6\">\n            <!-- USERS LIST -->\n            <div class=\"box box-danger\">\n              <div class=\"box-header with-border\">\n                <h3 class=\"box-title\">Latest Members</h3>\n\n                <div class=\"box-tools pull-right\">\n                  <span class=\"label label-danger\">8 New Members</span>\n                  <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"collapse\"><i class=\"fa fa-minus\"></i>\n                    </button>\n                  <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"remove\"><i class=\"fa fa-times\"></i>\n                    </button>\n                </div>\n              </div>\n              <!-- /.box-header -->\n              <div class=\"box-body no-padding\">\n                <ul class=\"users-list clearfix\">\n                  <li>\n                    <img src=\"assets/img/user1-128x128.jpg\" alt=\"User Image\">\n                    <a class=\"users-list-name\" href=\"#\">Alexander Pierce</a>\n                    <span class=\"users-list-date\">Today</span>\n                  </li>\n                  <li>\n                    <img src=\"assets/img/user8-128x128.jpg\" alt=\"User Image\">\n                    <a class=\"users-list-name\" href=\"#\">Norman</a>\n                    <span class=\"users-list-date\">Yesterday</span>\n                  </li>\n                  <li>\n                    <img src=\"assets/img/user7-128x128.jpg\" alt=\"User Image\">\n                    <a class=\"users-list-name\" href=\"#\">Jane</a>\n                    <span class=\"users-list-date\">12 Jan</span>\n                  </li>\n                  <li>\n                    <img src=\"assets/img/user6-128x128.jpg\" alt=\"User Image\">\n                    <a class=\"users-list-name\" href=\"#\">John</a>\n                    <span class=\"users-list-date\">12 Jan</span>\n                  </li>\n                  <li>\n                    <img src=\"assets/img/user2-160x160.jpg\" alt=\"User Image\">\n                    <a class=\"users-list-name\" href=\"#\">Alexander</a>\n                    <span class=\"users-list-date\">13 Jan</span>\n                  </li>\n                  <li>\n                    <img src=\"assets/img/user5-128x128.jpg\" alt=\"User Image\">\n                    <a class=\"users-list-name\" href=\"#\">Sarah</a>\n                    <span class=\"users-list-date\">14 Jan</span>\n                  </li>\n                  <li>\n                    <img src=\"assets/img/user4-128x128.jpg\" alt=\"User Image\">\n                    <a class=\"users-list-name\" href=\"#\">Nora</a>\n                    <span class=\"users-list-date\">15 Jan</span>\n                  </li>\n                  <li>\n                    <img src=\"assets/img/user3-128x128.jpg\" alt=\"User Image\">\n                    <a class=\"users-list-name\" href=\"#\">Nadia</a>\n                    <span class=\"users-list-date\">15 Jan</span>\n                  </li>\n                </ul>\n                <!-- /.users-list -->\n              </div>\n              <!-- /.box-body -->\n              <div class=\"box-footer text-center\">\n                <a href=\"javascript:void(0)\" class=\"uppercase\">View All Users</a>\n              </div>\n              <!-- /.box-footer -->\n            </div>\n            <!--/.box -->\n          </div>\n          <!-- /.col -->\n        </div>\n        <!-- /.row -->\n\n        <!-- TABLE: LATEST ORDERS -->\n        <div class=\"box box-info\">\n          <div class=\"box-header with-border\">\n            <h3 class=\"box-title\">Latest Orders</h3>\n\n            <div class=\"box-tools pull-right\">\n              <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"collapse\"><i class=\"fa fa-minus\"></i>\n                </button>\n              <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"remove\"><i class=\"fa fa-times\"></i></button>\n            </div>\n          </div>\n          <!-- /.box-header -->\n          <div class=\"box-body\">\n            <div class=\"table-responsive\">\n              <table class=\"table no-margin\">\n                <thead>\n                  <tr>\n                    <th>Order ID</th>\n                    <th>Item</th>\n                    <th>Status</th>\n                    <th>Popularity</th>\n                  </tr>\n                </thead>\n                <tbody>\n                  <tr>\n                    <td><a href=\"pages/examples/invoice.html\">OR9842</a></td>\n                    <td>Call of Duty IV</td>\n                    <td><span class=\"label label-success\">Shipped</span></td>\n                    <td>\n                      <div class=\"sparkbar\" data-color=\"#00a65a\" data-height=\"20\">90,80,90,-70,61,-83,63</div>\n                    </td>\n                  </tr>\n                  <tr>\n                    <td><a href=\"pages/examples/invoice.html\">OR1848</a></td>\n                    <td>Samsung Smart TV</td>\n                    <td><span class=\"label label-warning\">Pending</span></td>\n                    <td>\n                      <div class=\"sparkbar\" data-color=\"#f39c12\" data-height=\"20\">90,80,-90,70,61,-83,68</div>\n                    </td>\n                  </tr>\n                  <tr>\n                    <td><a href=\"pages/examples/invoice.html\">OR7429</a></td>\n                    <td>iPhone 6 Plus</td>\n                    <td><span class=\"label label-danger\">Delivered</span></td>\n                    <td>\n                      <div class=\"sparkbar\" data-color=\"#f56954\" data-height=\"20\">90,-80,90,70,-61,83,63</div>\n                    </td>\n                  </tr>\n                  <tr>\n                    <td><a href=\"pages/examples/invoice.html\">OR7429</a></td>\n                    <td>Samsung Smart TV</td>\n                    <td><span class=\"label label-info\">Processing</span></td>\n                    <td>\n                      <div class=\"sparkbar\" data-color=\"#00c0ef\" data-height=\"20\">90,80,-90,70,-61,83,63</div>\n                    </td>\n                  </tr>\n                  <tr>\n                    <td><a href=\"pages/examples/invoice.html\">OR1848</a></td>\n                    <td>Samsung Smart TV</td>\n                    <td><span class=\"label label-warning\">Pending</span></td>\n                    <td>\n                      <div class=\"sparkbar\" data-color=\"#f39c12\" data-height=\"20\">90,80,-90,70,61,-83,68</div>\n                    </td>\n                  </tr>\n                  <tr>\n                    <td><a href=\"pages/examples/invoice.html\">OR7429</a></td>\n                    <td>iPhone 6 Plus</td>\n                    <td><span class=\"label label-danger\">Delivered</span></td>\n                    <td>\n                      <div class=\"sparkbar\" data-color=\"#f56954\" data-height=\"20\">90,-80,90,70,-61,83,63</div>\n                    </td>\n                  </tr>\n                  <tr>\n                    <td><a href=\"pages/examples/invoice.html\">OR9842</a></td>\n                    <td>Call of Duty IV</td>\n                    <td><span class=\"label label-success\">Shipped</span></td>\n                    <td>\n                      <div class=\"sparkbar\" data-color=\"#00a65a\" data-height=\"20\">90,80,90,-70,61,-83,63</div>\n                    </td>\n                  </tr>\n                </tbody>\n              </table>\n            </div>\n            <!-- /.table-responsive -->\n          </div>\n          <!-- /.box-body -->\n          <div class=\"box-footer clearfix\">\n            <a href=\"javascript:void(0)\" class=\"btn btn-sm btn-info btn-flat pull-left\">Place New Order</a>\n            <a href=\"javascript:void(0)\" class=\"btn btn-sm btn-default btn-flat pull-right\">View All Orders</a>\n          </div>\n          <!-- /.box-footer -->\n        </div>\n        <!-- /.box -->\n      </div>\n      <!-- /.col -->\n\n      <div class=\"col-md-4\">\n        <!-- Info Boxes Style 2 -->\n        <div class=\"info-box bg-yellow\">\n          <span class=\"info-box-icon\"><i class=\"ion ion-ios-pricetag-outline\"></i></span>\n\n          <div class=\"info-box-content\">\n            <span class=\"info-box-text\">Inventory</span>\n            <span class=\"info-box-number\">5,200</span>\n\n            <div class=\"progress\">\n              <div class=\"progress-bar\" style=\"width: 50%\"></div>\n            </div>\n            <span class=\"progress-description\">\n                    50% Increase in 30 Days\n                  </span>\n          </div>\n          <!-- /.info-box-content -->\n        </div>\n        <!-- /.info-box -->\n        <div class=\"info-box bg-green\">\n          <span class=\"info-box-icon\"><i class=\"ion ion-ios-heart-outline\"></i></span>\n\n          <div class=\"info-box-content\">\n            <span class=\"info-box-text\">Mentions</span>\n            <span class=\"info-box-number\">92,050</span>\n\n            <div class=\"progress\">\n              <div class=\"progress-bar\" style=\"width: 20%\"></div>\n            </div>\n            <span class=\"progress-description\">\n                    20% Increase in 30 Days\n                  </span>\n          </div>\n          <!-- /.info-box-content -->\n        </div>\n        <!-- /.info-box -->\n        <div class=\"info-box bg-red\">\n          <span class=\"info-box-icon\"><i class=\"ion ion-ios-cloud-download-outline\"></i></span>\n\n          <div class=\"info-box-content\">\n            <span class=\"info-box-text\">Downloads</span>\n            <span class=\"info-box-number\">114,381</span>\n\n            <div class=\"progress\">\n              <div class=\"progress-bar\" style=\"width: 70%\"></div>\n            </div>\n            <span class=\"progress-description\">\n                    70% Increase in 30 Days\n                  </span>\n          </div>\n          <!-- /.info-box-content -->\n        </div>\n        <!-- /.info-box -->\n        <div class=\"info-box bg-aqua\">\n          <span class=\"info-box-icon\"><i class=\"ion-ios-chatbubble-outline\"></i></span>\n\n          <div class=\"info-box-content\">\n            <span class=\"info-box-text\">Direct Messages</span>\n            <span class=\"info-box-number\">163,921</span>\n\n            <div class=\"progress\">\n              <div class=\"progress-bar\" style=\"width: 40%\"></div>\n            </div>\n            <span class=\"progress-description\">\n                    40% Increase in 30 Days\n                  </span>\n          </div>\n          <!-- /.info-box-content -->\n        </div>\n        <!-- /.info-box -->\n\n        <div class=\"box box-default\">\n          <div class=\"box-header with-border\">\n            <h3 class=\"box-title\">Browser Usage</h3>\n\n            <div class=\"box-tools pull-right\">\n              <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"collapse\"><i class=\"fa fa-minus\"></i>\n                </button>\n              <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"remove\"><i class=\"fa fa-times\"></i></button>\n            </div>\n          </div>\n          <!-- /.box-header -->\n          <div class=\"box-body\">\n            <div class=\"row\">\n              <div class=\"col-md-8\">\n                <div class=\"chart-responsive\">\n                  <canvas id=\"pieChart\" height=\"150\"></canvas>\n                </div>\n                <!-- ./chart-responsive -->\n              </div>\n              <!-- /.col -->\n              <div class=\"col-md-4\">\n                <ul class=\"chart-legend clearfix\">\n                  <li><i class=\"fa fa-circle-o text-red\"></i> Chrome</li>\n                  <li><i class=\"fa fa-circle-o text-green\"></i> IE</li>\n                  <li><i class=\"fa fa-circle-o text-yellow\"></i> FireFox</li>\n                  <li><i class=\"fa fa-circle-o text-aqua\"></i> Safari</li>\n                  <li><i class=\"fa fa-circle-o text-light-blue\"></i> Opera</li>\n                  <li><i class=\"fa fa-circle-o text-gray\"></i> Navigator</li>\n                </ul>\n              </div>\n              <!-- /.col -->\n            </div>\n            <!-- /.row -->\n          </div>\n          <!-- /.box-body -->\n          <div class=\"box-footer no-padding\">\n            <ul class=\"nav nav-pills nav-stacked\">\n              <li><a href=\"#\">United States of America\n                  <span class=\"pull-right text-red\"><i class=\"fa fa-angle-down\"></i> 12%</span></a></li>\n              <li><a href=\"#\">India <span class=\"pull-right text-green\"><i class=\"fa fa-angle-up\"></i> 4%</span></a>\n              </li>\n              <li><a href=\"#\">China\n                  <span class=\"pull-right text-yellow\"><i class=\"fa fa-angle-left\"></i> 0%</span></a></li>\n            </ul>\n          </div>\n          <!-- /.footer -->\n        </div>\n        <!-- /.box -->\n\n        <!-- PRODUCT LIST -->\n        <div class=\"box box-primary\">\n          <div class=\"box-header with-border\">\n            <h3 class=\"box-title\">Recently Added Products</h3>\n\n            <div class=\"box-tools pull-right\">\n              <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"collapse\"><i class=\"fa fa-minus\"></i>\n                </button>\n              <button type=\"button\" class=\"btn btn-box-tool\" data-widget=\"remove\"><i class=\"fa fa-times\"></i></button>\n            </div>\n          </div>\n          <!-- /.box-header -->\n          <div class=\"box-body\">\n            <ul class=\"products-list product-list-in-box\">\n              <li class=\"item\">\n                <div class=\"product-img\">\n                  <img src=\"assets/img/default-50x50.gif\" alt=\"Product Image\">\n                </div>\n                <div class=\"product-info\">\n                  <a href=\"javascript:void(0)\" class=\"product-title\">Samsung TV\n                      <span class=\"label label-warning pull-right\">$1800</span></a>\n                  <span class=\"product-description\">\n                          Samsung 32\" 1080p 60Hz LED Smart HDTV.\n                        </span>\n                </div>\n              </li>\n              <!-- /.item -->\n              <li class=\"item\">\n                <div class=\"product-img\">\n                  <img src=\"assets/img/default-50x50.gif\" alt=\"Product Image\">\n                </div>\n                <div class=\"product-info\">\n                  <a href=\"javascript:void(0)\" class=\"product-title\">Bicycle\n                      <span class=\"label label-info pull-right\">$700</span></a>\n                  <span class=\"product-description\">\n                          26\" Mongoose Dolomite Men's 7-speed, Navy Blue.\n                        </span>\n                </div>\n              </li>\n              <!-- /.item -->\n              <li class=\"item\">\n                <div class=\"product-img\">\n                  <img src=\"assets/img/default-50x50.gif\" alt=\"Product Image\">\n                </div>\n                <div class=\"product-info\">\n                  <a href=\"javascript:void(0)\" class=\"product-title\">Xbox One <span class=\"label label-danger pull-right\">$350</span></a>\n                  <span class=\"product-description\">\n                          Xbox One Console Bundle with Halo Master Chief Collection.\n                        </span>\n                </div>\n              </li>\n              <!-- /.item -->\n              <li class=\"item\">\n                <div class=\"product-img\">\n                  <img src=\"assets/img/default-50x50.gif\" alt=\"Product Image\">\n                </div>\n                <div class=\"product-info\">\n                  <a href=\"javascript:void(0)\" class=\"product-title\">PlayStation 4\n                      <span class=\"label label-success pull-right\">$399</span></a>\n                  <span class=\"product-description\">\n                          PlayStation 4 500GB Console (PS4)\n                        </span>\n                </div>\n              </li>\n              <!-- /.item -->\n            </ul>\n          </div>\n          <!-- /.box-body -->\n          <div class=\"box-footer text-center\">\n            <a href=\"javascript:void(0)\" class=\"uppercase\">View All Products</a>\n          </div>\n          <!-- /.box-footer -->\n        </div>\n        <!-- /.box -->\n      </div>\n      <!-- /.col -->\n    </div>\n    <!-- /.row -->\n  </section>\n  <!-- /.content -->\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/admin/admin-dashboard2/admin-dashboard2.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminDashboard2Component; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AdminDashboard2Component = (function () {
    function AdminDashboard2Component() {
    }
    AdminDashboard2Component.prototype.ngOnInit = function () {
        // Actualiza la barra latera y el footer
        AdminLTE.init();
    };
    AdminDashboard2Component = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-admin-dashboard2',
            template: __webpack_require__("../../../../../src/app/admin/admin-dashboard2/admin-dashboard2.component.html"),
            styles: [__webpack_require__("../../../../../src/app/admin/admin-dashboard2/admin-dashboard2.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], AdminDashboard2Component);
    return AdminDashboard2Component;
}());



/***/ }),

/***/ "../../../../../src/app/admin/admin-footer/admin-footer.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/admin/admin-footer/admin-footer.component.html":
/***/ (function(module, exports) {

module.exports = "<footer class=\"main-footer\">\n  <div class=\"pull-right hidden-xs\">\n      <b>Version</b> 1.0.11\n    </div>\n    <strong>Copyright &copy; 2018 <a href=\"http://www.EvolveChain.org\">EvolveChain</a>.</strong> All rights reserved.\n</footer>\n"

/***/ }),

/***/ "../../../../../src/app/admin/admin-footer/admin-footer.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminFooterComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AdminFooterComponent = (function () {
    function AdminFooterComponent() {
    }
    AdminFooterComponent.prototype.ngOnInit = function () {
    };
    AdminFooterComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-admin-footer',
            template: __webpack_require__("../../../../../src/app/admin/admin-footer/admin-footer.component.html"),
            styles: [__webpack_require__("../../../../../src/app/admin/admin-footer/admin-footer.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], AdminFooterComponent);
    return AdminFooterComponent;
}());



/***/ }),

/***/ "../../../../../src/app/admin/admin-header/admin-header.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/admin/admin-header/admin-header.component.html":
/***/ (function(module, exports) {

module.exports = "<header class=\"main-header\">\n  <!-- Logo -->\n  <a href=\"index.html\" class=\"logo\">\n    <!-- mini logo for sidebar mini 50x50 pixels -->\n    <span class=\"logo-mini\"><b>EC</b></span>\n    <!-- logo for regular state and mobile devices -->\n    <span class=\"logo-lg\"><b>EvolveChain</b>KYC</span>\n  </a>\n  <!-- Header Navbar: style can be found in header.less -->\n  <nav class=\"navbar navbar-static-top\">\n    <!-- Sidebar toggle button-->\n    <a href=\"#\" class=\"sidebar-toggle\" data-toggle=\"offcanvas\" role=\"button\">\n        <span class=\"sr-only\">Toggle navigation</span>\n      </a>\n\n    <div class=\"navbar-custom-menu\">\n      <ul class=\"nav navbar-nav\">\n        <!-- Messages: style can be found in dropdown.less-->\n        <li class=\"dropdown messages-menu\">\n          <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n              <i class=\"fa fa-envelope-o\"></i>\n              <span class=\"label label-success\">4</span>\n            </a>\n          <ul class=\"dropdown-menu\">\n            <li class=\"header\">You have 4 messages</li>\n            <li>\n              <!-- inner menu: contains the actual data -->\n              <ul class=\"menu\">\n                <li>\n                  <!-- start message -->\n                  <a href=\"#\">\n                    <div class=\"pull-left\">\n                      <img src=\"assets/img/user2-160x160.jpg\" class=\"img-circle\" alt=\"User Image\">\n                    </div>\n                    <h4>\n                      Support Team\n                      <small><i class=\"fa fa-clock-o\"></i> 5 mins</small>\n                    </h4>\n                    <p>Why not buy a new awesome theme?</p>\n                  </a>\n                </li>\n                <!-- end message -->\n                <li>\n                  <a href=\"#\">\n                    <div class=\"pull-left\">\n                      <img src=\"assets/img/user3-128x128.jpg\" class=\"img-circle\" alt=\"User Image\">\n                    </div>\n                    <h4>\n                      AdminLTE Design Team\n                      <small><i class=\"fa fa-clock-o\"></i> 2 hours</small>\n                    </h4>\n                    <p>Why not buy a new awesome theme?</p>\n                  </a>\n                </li>\n                <li>\n                  <a href=\"#\">\n                    <div class=\"pull-left\">\n                      <img src=\"assets/img/user4-128x128.jpg\" class=\"img-circle\" alt=\"User Image\">\n                    </div>\n                    <h4>\n                      Developers\n                      <small><i class=\"fa fa-clock-o\"></i> Today</small>\n                    </h4>\n                    <p>Why not buy a new awesome theme?</p>\n                  </a>\n                </li>\n                <li>\n                  <a href=\"#\">\n                    <div class=\"pull-left\">\n                      <img src=\"assets/img/user3-128x128.jpg\" class=\"img-circle\" alt=\"User Image\">\n                    </div>\n                    <h4>\n                      Sales Department\n                      <small><i class=\"fa fa-clock-o\"></i> Yesterday</small>\n                    </h4>\n                    <p>Why not buy a new awesome theme?</p>\n                  </a>\n                </li>\n                <li>\n                  <a href=\"#\">\n                    <div class=\"pull-left\">\n                      <img src=\"assets/img/user4-128x128.jpg\" class=\"img-circle\" alt=\"User Image\">\n                    </div>\n                    <h4>\n                      Reviewers\n                      <small><i class=\"fa fa-clock-o\"></i> 2 days</small>\n                    </h4>\n                    <p>Why not buy a new awesome theme?</p>\n                  </a>\n                </li>\n              </ul>\n            </li>\n            <li class=\"footer\"><a href=\"#\">See All Messages</a></li>\n          </ul>\n        </li>\n        <!-- Notifications: style can be found in dropdown.less -->\n        <li class=\"dropdown notifications-menu\">\n          <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n              <i class=\"fa fa-bell-o\"></i>\n              <span class=\"label label-warning\">10</span>\n            </a>\n          <ul class=\"dropdown-menu\">\n            <li class=\"header\">You have 10 notifications</li>\n            <li>\n              <!-- inner menu: contains the actual data -->\n              <ul class=\"menu\">\n                <li>\n                  <a href=\"#\">\n                      <i class=\"fa fa-users text-aqua\"></i> 5 new members joined today\n                    </a>\n                </li>\n                <li>\n                  <a href=\"#\">\n                      <i class=\"fa fa-warning text-yellow\"></i> Very long description here that may not fit into the\n                      page and may cause design problems\n                    </a>\n                </li>\n                <li>\n                  <a href=\"#\">\n                      <i class=\"fa fa-users text-red\"></i> 5 new members joined\n                    </a>\n                </li>\n                <li>\n                  <a href=\"#\">\n                      <i class=\"fa fa-shopping-cart text-green\"></i> 25 sales made\n                    </a>\n                </li>\n                <li>\n                  <a href=\"#\">\n                      <i class=\"fa fa-user text-red\"></i> You changed your username\n                    </a>\n                </li>\n              </ul>\n            </li>\n            <li class=\"footer\"><a href=\"#\">View all</a></li>\n          </ul>\n        </li>\n        <!-- Tasks: style can be found in dropdown.less -->\n        <li class=\"dropdown tasks-menu\">\n          <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n              <i class=\"fa fa-flag-o\"></i>\n              <span class=\"label label-danger\">9</span>\n            </a>\n          <ul class=\"dropdown-menu\">\n            <li class=\"header\">You have 9 tasks</li>\n            <li>\n              <!-- inner menu: contains the actual data -->\n              <ul class=\"menu\">\n                <li>\n                  <!-- Task item -->\n                  <a href=\"#\">\n                    <h3>\n                      Design some buttons\n                      <small class=\"pull-right\">20%</small>\n                    </h3>\n                    <div class=\"progress xs\">\n                      <div class=\"progress-bar progress-bar-aqua\" style=\"width: 20%\" role=\"progressbar\" aria-valuenow=\"20\" aria-valuemin=\"0\" aria-valuemax=\"100\">\n                        <span class=\"sr-only\">20% Complete</span>\n                      </div>\n                    </div>\n                  </a>\n                </li>\n                <!-- end task item -->\n                <li>\n                  <!-- Task item -->\n                  <a href=\"#\">\n                    <h3>\n                      Create a nice theme\n                      <small class=\"pull-right\">40%</small>\n                    </h3>\n                    <div class=\"progress xs\">\n                      <div class=\"progress-bar progress-bar-green\" style=\"width: 40%\" role=\"progressbar\" aria-valuenow=\"20\" aria-valuemin=\"0\" aria-valuemax=\"100\">\n                        <span class=\"sr-only\">40% Complete</span>\n                      </div>\n                    </div>\n                  </a>\n                </li>\n                <!-- end task item -->\n                <li>\n                  <!-- Task item -->\n                  <a href=\"#\">\n                    <h3>\n                      Some task I need to do\n                      <small class=\"pull-right\">60%</small>\n                    </h3>\n                    <div class=\"progress xs\">\n                      <div class=\"progress-bar progress-bar-red\" style=\"width: 60%\" role=\"progressbar\" aria-valuenow=\"20\" aria-valuemin=\"0\" aria-valuemax=\"100\">\n                        <span class=\"sr-only\">60% Complete</span>\n                      </div>\n                    </div>\n                  </a>\n                </li>\n                <!-- end task item -->\n                <li>\n                  <!-- Task item -->\n                  <a href=\"#\">\n                    <h3>\n                      Make beautiful transitions\n                      <small class=\"pull-right\">80%</small>\n                    </h3>\n                    <div class=\"progress xs\">\n                      <div class=\"progress-bar progress-bar-yellow\" style=\"width: 80%\" role=\"progressbar\" aria-valuenow=\"20\" aria-valuemin=\"0\"\n                        aria-valuemax=\"100\">\n                        <span class=\"sr-only\">80% Complete</span>\n                      </div>\n                    </div>\n                  </a>\n                </li>\n                <!-- end task item -->\n              </ul>\n            </li>\n            <li class=\"footer\">\n              <a href=\"#\">View all tasks</a>\n            </li>\n          </ul>\n        </li>\n        <!-- User Account: style can be found in dropdown.less -->\n        <li class=\"dropdown user user-menu\">\n          <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n              <!-- <img src=\"assets/img/user2-160x160.jpg\" class=\"user-image\" alt=\"User Image\"> -->\n              <span class=\"hidden-xs\">Admin</span>\n            </a>\n          <ul class=\"dropdown-menu\">\n            <!-- User image -->\n            <li class=\"user-header\">\n              <img src=\"assets/img/logo.png\" class=\"img-circle\" alt=\"User Image\">\n\n              <p>\n               Administrator\n                <small>EvolveChain KYC Team</small>\n              </p>\n            </li>\n            <!-- Menu Body -->\n            <!-- <li class=\"user-body\">\n              <div class=\"row\">\n                <div class=\"col-xs-4 text-center\">\n                  <a href=\"#\">Followers</a>\n                </div>\n                <div class=\"col-xs-4 text-center\">\n                  <a href=\"#\">Sales</a>\n                </div>\n                <div class=\"col-xs-4 text-center\">\n                  <a href=\"#\">Friends</a>\n                </div>\n              </div>            \n            </li> -->\n            <!-- Menu Footer-->\n            <li class=\"user-footer\">\n              <div class=\"pull-left\">\n                <a href=\"#\" class=\"btn btn-default btn-flat\">Profile</a>\n              </div>\n              <div class=\"pull-right\">\n                <a href=\"#\" class=\"btn btn-default btn-flat\">Sign out</a>\n              </div>\n            </li>\n          </ul>\n        </li>\n        <!-- Control Sidebar Toggle Button -->\n        <li>\n          <a href=\"#\" data-toggle=\"control-sidebar\"><i class=\"fa fa-gears\"></i></a>\n        </li>\n      </ul>\n    </div>\n  </nav>\n</header>\n"

/***/ }),

/***/ "../../../../../src/app/admin/admin-header/admin-header.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminHeaderComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AdminHeaderComponent = (function () {
    function AdminHeaderComponent() {
    }
    AdminHeaderComponent.prototype.ngOnInit = function () {
    };
    AdminHeaderComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-admin-header',
            template: __webpack_require__("../../../../../src/app/admin/admin-header/admin-header.component.html"),
            styles: [__webpack_require__("../../../../../src/app/admin/admin-header/admin-header.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], AdminHeaderComponent);
    return AdminHeaderComponent;
}());



/***/ }),

/***/ "../../../../../src/app/admin/admin-left-side/admin-left-side.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/admin/admin-left-side/admin-left-side.component.html":
/***/ (function(module, exports) {

module.exports = "<aside class=\"main-sidebar\">\n  <!-- sidebar: style can be found in sidebar.less -->\n  <section class=\"sidebar\">\n    <!-- Sidebar user panel -->\n    <!-- <div class=\"user-panel\">\n      <div class=\"pull-left image\">\n        <img src=\"assets/img/user2-160x160.jpg\" class=\"img-circle\" alt=\"User Image\">\n      </div>\n      <div class=\"pull-left info\">\n        <p>Alexander Pierce</p>\n        <a href=\"#\"><i class=\"fa fa-circle text-success\"></i> Online</a>\n      </div>\n    </div> -->\n    <!-- search form -->\n    <form action=\"#\" method=\"get\" class=\"sidebar-form\">\n      <div class=\"input-group\">\n        <input type=\"text\" name=\"q\" class=\"form-control\" placeholder=\"Search Applications...\">\n        <span class=\"input-group-btn\">\n                <button type=\"submit\" name=\"search\" id=\"search-btn\" class=\"btn btn-flat\"><i class=\"fa fa-search\"></i>\n                </button>\n              </span>\n      </div>\n    </form>\n    <!-- /.search form -->\n    <!-- sidebar menu: : style can be found in sidebar.less -->\n    <ul class=\"sidebar-menu\">\n      <!-- <li class=\"header\">MAIN NAVIGATION</li> -->\n      <!-- <li class=\"active treeview\">\n        <a href=\"#\">\n            <i class=\"fa fa-dashboard\"></i> <span>Dashboard</span>\n            <span class=\"pull-right-container\">\n              <i class=\"fa fa-angle-left pull-right\"></i>\n            </span>\n          </a>\n        <ul class=\"treeview-menu\">\n          <li class=\"active\"><a routerLink=\"dashboard1\"><i class=\"fa fa-circle-o\"></i> Dashboard v1</a></li>\n          <li><a routerLink=\"dashboard2\"><i class=\"fa fa-circle-o\"></i> Dashboard v2</a></li>\n        </ul>\n      </li> -->\n      <li ><a routerLink=\"dashboard\"><i class=\"fa fa-dashboard\"></i> <span>Dashboard</span></a></li>\n      <!-- <li ><a routerLink=\"dashboard1\"><i class=\"fa fa-dashboard\"></i> <span>Dashboard1</span></a></li>\t  -->\n      <li class=\"treeview\">\n        <a href=\"#\">\n            <i class=\"fa fa-folder\"></i>\n            <span>Applications</span>\n            <span class=\"pull-right-container\">\n              <span class=\"label label-primary pull-right\"></span>\n            </span>\n          </a>\n        <ul class=\"treeview-menu\">\n          <li><a ><i class=\"fa fa-circle-o\"></i>Pending</a></li>\n          <li><a ><i class=\"fa fa-circle-o\"></i>InProcess</a></li>\n          <li><a ><i class=\"fa fa-circle-o\"></i>Rejected</a></li>\n          <li><a ><i class=\"fa fa-circle-o\"></i>Expired</a></li>\n          <li><a ><i class=\"fa fa-circle-o\"></i>Verified</a></li>\n        </ul>\n      </li>\n\n      <!-- <li>\n        <a href=\"pages/widgets.html\">\n            <i class=\"fa fa-th\"></i> <span>Widgets</span>\n            <span class=\"pull-right-container\">\n              <small class=\"label pull-right bg-green\">new</small>\n            </span>\n          </a>\n      </li>\n      <li class=\"treeview\">\n        <a href=\"#\">\n            <i class=\"fa fa-pie-chart\"></i>\n            <span>Charts</span>\n            <span class=\"pull-right-container\">\n              <i class=\"fa fa-angle-left pull-right\"></i>\n            </span>\n          </a>\n        <ul class=\"treeview-menu\">\n          <li><a href=\"pages/charts/chartjs.html\"><i class=\"fa fa-circle-o\"></i> ChartJS</a></li>\n          <li><a href=\"pages/charts/morris.html\"><i class=\"fa fa-circle-o\"></i> Morris</a></li>\n          <li><a href=\"pages/charts/flot.html\"><i class=\"fa fa-circle-o\"></i> Flot</a></li>\n          <li><a href=\"pages/charts/inline.html\"><i class=\"fa fa-circle-o\"></i> Inline charts</a></li>\n        </ul>\n      </li>\n      <li class=\"treeview\">\n        <a href=\"#\">\n            <i class=\"fa fa-laptop\"></i>\n            <span>UI Elements</span>\n            <span class=\"pull-right-container\">\n              <i class=\"fa fa-angle-left pull-right\"></i>\n            </span>\n          </a>\n        <ul class=\"treeview-menu\">\n          <li><a href=\"pages/UI/general.html\"><i class=\"fa fa-circle-o\"></i> General</a></li>\n          <li><a href=\"pages/UI/icons.html\"><i class=\"fa fa-circle-o\"></i> Icons</a></li>\n          <li><a href=\"pages/UI/buttons.html\"><i class=\"fa fa-circle-o\"></i> Buttons</a></li>\n          <li><a href=\"pages/UI/sliders.html\"><i class=\"fa fa-circle-o\"></i> Sliders</a></li>\n          <li><a href=\"pages/UI/timeline.html\"><i class=\"fa fa-circle-o\"></i> Timeline</a></li>\n          <li><a href=\"pages/UI/modals.html\"><i class=\"fa fa-circle-o\"></i> Modals</a></li>\n        </ul>\n      </li>\n      <li class=\"treeview\">\n        <a href=\"#\">\n            <i class=\"fa fa-edit\"></i> <span>Forms</span>\n            <span class=\"pull-right-container\">\n              <i class=\"fa fa-angle-left pull-right\"></i>\n            </span>\n          </a>\n        <ul class=\"treeview-menu\">\n          <li><a href=\"pages/forms/general.html\"><i class=\"fa fa-circle-o\"></i> General Elements</a></li>\n          <li><a href=\"pages/forms/advanced.html\"><i class=\"fa fa-circle-o\"></i> Advanced Elements</a></li>\n          <li><a href=\"pages/forms/editors.html\"><i class=\"fa fa-circle-o\"></i> Editors</a></li>\n        </ul>\n      </li>\n      <li class=\"treeview\">\n        <a href=\"#\">\n            <i class=\"fa fa-table\"></i> <span>Tables</span>\n            <span class=\"pull-right-container\">\n              <i class=\"fa fa-angle-left pull-right\"></i>\n            </span>\n          </a>\n        <ul class=\"treeview-menu\">\n          <li><a href=\"pages/tables/simple.html\"><i class=\"fa fa-circle-o\"></i> Simple tables</a></li>\n          <li><a href=\"pages/tables/data.html\"><i class=\"fa fa-circle-o\"></i> Data tables</a></li>\n        </ul>\n      </li>\n      <li>\n        <a href=\"pages/calendar.html\">\n            <i class=\"fa fa-calendar\"></i> <span>Calendar</span>\n            <span class=\"pull-right-container\">\n              <small class=\"label pull-right bg-red\">3</small>\n              <small class=\"label pull-right bg-blue\">17</small>\n            </span>\n          </a>\n      </li>\n      <li>\n        <a href=\"pages/mailbox/mailbox.html\">\n            <i class=\"fa fa-envelope\"></i> <span>Mailbox</span>\n            <span class=\"pull-right-container\">\n              <small class=\"label pull-right bg-yellow\">12</small>\n              <small class=\"label pull-right bg-green\">16</small>\n              <small class=\"label pull-right bg-red\">5</small>\n            </span>\n          </a>\n      </li>\n      <li class=\"treeview\">\n        <a href=\"#\">\n            <i class=\"fa fa-folder\"></i> <span>Examples</span>\n            <span class=\"pull-right-container\">\n              <i class=\"fa fa-angle-left pull-right\"></i>\n            </span>\n          </a>\n        <ul class=\"treeview-menu\">\n          <li><a href=\"pages/examples/invoice.html\"><i class=\"fa fa-circle-o\"></i> Invoice</a></li>\n          <li><a href=\"pages/examples/profile.html\"><i class=\"fa fa-circle-o\"></i> Profile</a></li>\n          <li><a href=\"pages/examples/login.html\"><i class=\"fa fa-circle-o\"></i> Login</a></li>\n          <li><a href=\"pages/examples/register.html\"><i class=\"fa fa-circle-o\"></i> Register</a></li>\n          <li><a href=\"pages/examples/lockscreen.html\"><i class=\"fa fa-circle-o\"></i> Lockscreen</a></li>\n          <li><a href=\"pages/examples/404.html\"><i class=\"fa fa-circle-o\"></i> 404 Error</a></li>\n          <li><a href=\"pages/examples/500.html\"><i class=\"fa fa-circle-o\"></i> 500 Error</a></li>\n          <li><a href=\"pages/examples/blank.html\"><i class=\"fa fa-circle-o\"></i> Blank Page</a></li>\n          <li><a href=\"pages/examples/pace.html\"><i class=\"fa fa-circle-o\"></i> Pace Page</a></li>\n        </ul>\n      </li>\n      <li class=\"treeview\">\n        <a href=\"#\">\n            <i class=\"fa fa-share\"></i> <span>Multilevel</span>\n            <span class=\"pull-right-container\">\n              <i class=\"fa fa-angle-left pull-right\"></i>\n            </span>\n          </a>\n        <ul class=\"treeview-menu\">\n          <li><a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level One</a></li>\n          <li>\n            <a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level One\n                <span class=\"pull-right-container\">\n                  <i class=\"fa fa-angle-left pull-right\"></i>\n                </span>\n              </a>\n            <ul class=\"treeview-menu\">\n              <li><a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level Two</a></li>\n              <li>\n                <a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level Two\n                    <span class=\"pull-right-container\">\n                      <i class=\"fa fa-angle-left pull-right\"></i>\n                    </span>\n                  </a>\n                <ul class=\"treeview-menu\">\n                  <li><a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level Three</a></li>\n                  <li><a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level Three</a></li>\n                </ul>\n              </li>\n            </ul>\n          </li>\n          <li><a href=\"#\"><i class=\"fa fa-circle-o\"></i> Level One</a></li>\n        </ul>\n      </li>\n      <li><a href=\"documentation/index.html\"><i class=\"fa fa-book\"></i> <span>Documentation</span></a></li>\n      <li class=\"header\">LABELS</li>\n      <li><a href=\"#\"><i class=\"fa fa-circle-o text-red\"></i> <span>Important</span></a></li>\n      <li><a href=\"#\"><i class=\"fa fa-circle-o text-yellow\"></i> <span>Warning</span></a></li>\n      <li><a href=\"#\"><i class=\"fa fa-circle-o text-aqua\"></i> <span>Information</span></a></li> -->\n    </ul>\n  </section>\n  <!-- /.sidebar -->\n</aside>\n"

/***/ }),

/***/ "../../../../../src/app/admin/admin-left-side/admin-left-side.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminLeftSideComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AdminLeftSideComponent = (function () {
    function AdminLeftSideComponent() {
    }
    AdminLeftSideComponent.prototype.ngOnInit = function () {
    };
    AdminLeftSideComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-admin-left-side',
            template: __webpack_require__("../../../../../src/app/admin/admin-left-side/admin-left-side.component.html"),
            styles: [__webpack_require__("../../../../../src/app/admin/admin-left-side/admin-left-side.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], AdminLeftSideComponent);
    return AdminLeftSideComponent;
}());



/***/ }),

/***/ "../../../../../src/app/admin/admin-routing/admin-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__admin_dashboard2_admin_dashboard2_component__ = __webpack_require__("../../../../../src/app/admin/admin-dashboard2/admin-dashboard2.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__admin_dashboard1_admin_dashboard1_component__ = __webpack_require__("../../../../../src/app/admin/admin-dashboard1/admin-dashboard1.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__admin_component__ = __webpack_require__("../../../../../src/app/admin/admin.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__admin_dashboard_admin_dashboard_component__ = __webpack_require__("../../../../../src/app/admin/admin-dashboard/admin-dashboard.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var AdminRoutingModule = (function () {
    function AdminRoutingModule() {
    }
    AdminRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["I" /* NgModule */])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_4__angular_router__["b" /* RouterModule */].forChild([
                    {
                        path: 'admin',
                        component: __WEBPACK_IMPORTED_MODULE_2__admin_component__["a" /* AdminComponent */],
                        children: [
                            {
                                path: '',
                                redirectTo: 'dashboard',
                                pathMatch: 'full'
                            },
                            {
                                path: 'dashboard',
                                component: __WEBPACK_IMPORTED_MODULE_5__admin_dashboard_admin_dashboard_component__["a" /* AdminDashboardComponent */]
                            },
                            {
                                path: 'dashboard1',
                                component: __WEBPACK_IMPORTED_MODULE_1__admin_dashboard1_admin_dashboard1_component__["a" /* AdminDashboard1Component */]
                            },
                            {
                                path: 'dashboard2',
                                component: __WEBPACK_IMPORTED_MODULE_0__admin_dashboard2_admin_dashboard2_component__["a" /* AdminDashboard2Component */]
                            }
                        ]
                    }
                ])
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_4__angular_router__["b" /* RouterModule */]
            ]
        })
    ], AdminRoutingModule);
    return AdminRoutingModule;
}());



/***/ }),

/***/ "../../../../../src/app/admin/admin.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/admin/admin.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"wrapper\">\n\n  <app-admin-header></app-admin-header>\n  <!-- Left side column. contains the logo and sidebar -->\n  <app-admin-left-side></app-admin-left-side>\n\n  <!-- Content Wrapper. Contains page content -->\n  <router-outlet></router-outlet>\n  <!-- /.content-wrapper -->\n  <app-admin-footer></app-admin-footer>\n\n  <!-- Control Sidebar -->\n  <app-admin-control-sidebar></app-admin-control-sidebar>\n  <!-- /.control-sidebar -->\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/admin/admin.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AdminComponent = (function () {
    function AdminComponent() {
        this.bodyClasses = 'skin-blue sidebar-mini';
        this.body = document.getElementsByTagName('body')[0];
    }
    AdminComponent.prototype.ngOnInit = function () {
        // add the the body classes
        this.body.classList.add('skin-blue');
        this.body.classList.add('sidebar-mini');
    };
    AdminComponent.prototype.ngOnDestroy = function () {
        // remove the the body classes
        this.body.classList.remove('skin-blue');
        this.body.classList.remove('sidebar-mini');
    };
    AdminComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-admin',
            template: __webpack_require__("../../../../../src/app/admin/admin.component.html"),
            styles: [__webpack_require__("../../../../../src/app/admin/admin.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], AdminComponent);
    return AdminComponent;
}());



/***/ }),

/***/ "../../../../../src/app/admin/admin.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__admin_routing_admin_routing_module__ = __webpack_require__("../../../../../src/app/admin/admin-routing/admin-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__admin_dashboard1_admin_dashboard1_component__ = __webpack_require__("../../../../../src/app/admin/admin-dashboard1/admin-dashboard1.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__admin_control_sidebar_admin_control_sidebar_component__ = __webpack_require__("../../../../../src/app/admin/admin-control-sidebar/admin-control-sidebar.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__admin_footer_admin_footer_component__ = __webpack_require__("../../../../../src/app/admin/admin-footer/admin-footer.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__admin_content_admin_content_component__ = __webpack_require__("../../../../../src/app/admin/admin-content/admin-content.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__admin_left_side_admin_left_side_component__ = __webpack_require__("../../../../../src/app/admin/admin-left-side/admin-left-side.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__admin_header_admin_header_component__ = __webpack_require__("../../../../../src/app/admin/admin-header/admin-header.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__admin_component__ = __webpack_require__("../../../../../src/app/admin/admin.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__angular_common__ = __webpack_require__("../../../common/esm5/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__admin_dashboard2_admin_dashboard2_component__ = __webpack_require__("../../../../../src/app/admin/admin-dashboard2/admin-dashboard2.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__admin_dashboard_admin_dashboard_component__ = __webpack_require__("../../../../../src/app/admin/admin-dashboard/admin-dashboard.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};












var AdminModule = (function () {
    function AdminModule() {
    }
    AdminModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_8__angular_core__["I" /* NgModule */])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_9__angular_common__["b" /* CommonModule */],
                __WEBPACK_IMPORTED_MODULE_0__admin_routing_admin_routing_module__["a" /* AdminRoutingModule */]
            ],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_7__admin_component__["a" /* AdminComponent */],
                __WEBPACK_IMPORTED_MODULE_6__admin_header_admin_header_component__["a" /* AdminHeaderComponent */],
                __WEBPACK_IMPORTED_MODULE_5__admin_left_side_admin_left_side_component__["a" /* AdminLeftSideComponent */],
                __WEBPACK_IMPORTED_MODULE_4__admin_content_admin_content_component__["a" /* AdminContentComponent */],
                __WEBPACK_IMPORTED_MODULE_3__admin_footer_admin_footer_component__["a" /* AdminFooterComponent */],
                __WEBPACK_IMPORTED_MODULE_2__admin_control_sidebar_admin_control_sidebar_component__["a" /* AdminControlSidebarComponent */],
                __WEBPACK_IMPORTED_MODULE_1__admin_dashboard1_admin_dashboard1_component__["a" /* AdminDashboard1Component */],
                __WEBPACK_IMPORTED_MODULE_10__admin_dashboard2_admin_dashboard2_component__["a" /* AdminDashboard2Component */],
                __WEBPACK_IMPORTED_MODULE_11__admin_dashboard_admin_dashboard_component__["a" /* AdminDashboardComponent */]
            ],
            exports: [__WEBPACK_IMPORTED_MODULE_7__admin_component__["a" /* AdminComponent */]]
        })
    ], AdminModule);
    return AdminModule;
}());



/***/ }),

/***/ "../../../../../src/app/app-routing/app-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__starter_starter_component__ = __webpack_require__("../../../../../src/app/starter/starter.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home_component__ = __webpack_require__("../../../../../src/app/home/home.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* RouterModule */].forRoot([
                    { path: '', redirectTo: 'home', pathMatch: 'full' },
                    { path: 'home', component: __WEBPACK_IMPORTED_MODULE_3__home_home_component__["a" /* HomeComponent */] },
                    { path: 'starter', component: __WEBPACK_IMPORTED_MODULE_0__starter_starter_component__["a" /* StarterComponent */] }
                ])
            ],
            declarations: [],
            exports: [__WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* RouterModule */]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "../../../../../src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>\n\n"

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = (function () {
    function AppComponent() {
        this.title = 'app';
    }
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__("../../../../../src/app/app.component.html"),
            styles: [__webpack_require__("../../../../../src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__admin_admin_module__ = __webpack_require__("../../../../../src/app/admin/admin.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_routing_app_routing_module__ = __webpack_require__("../../../../../src/app/app-routing/app-routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__ = __webpack_require__("../../../platform-browser/esm5/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__starter_starter_component__ = __webpack_require__("../../../../../src/app/starter/starter.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__starter_starter_header_starter_header_component__ = __webpack_require__("../../../../../src/app/starter/starter-header/starter-header.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__starter_starter_left_side_starter_left_side_component__ = __webpack_require__("../../../../../src/app/starter/starter-left-side/starter-left-side.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__starter_starter_content_starter_content_component__ = __webpack_require__("../../../../../src/app/starter/starter-content/starter-content.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__starter_starter_footer_starter_footer_component__ = __webpack_require__("../../../../../src/app/starter/starter-footer/starter-footer.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__starter_starter_control_sidebar_starter_control_sidebar_component__ = __webpack_require__("../../../../../src/app/starter/starter-control-sidebar/starter-control-sidebar.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__home_home_component__ = __webpack_require__("../../../../../src/app/home/home.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_ng2_parallaxscroll__ = __webpack_require__("../../../../ng2-parallaxscroll/modules/ng2-parallaxscroll.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};













var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_5__starter_starter_component__["a" /* StarterComponent */],
                __WEBPACK_IMPORTED_MODULE_6__starter_starter_header_starter_header_component__["a" /* StarterHeaderComponent */],
                __WEBPACK_IMPORTED_MODULE_7__starter_starter_left_side_starter_left_side_component__["a" /* StarterLeftSideComponent */],
                __WEBPACK_IMPORTED_MODULE_8__starter_starter_content_starter_content_component__["a" /* StarterContentComponent */],
                __WEBPACK_IMPORTED_MODULE_9__starter_starter_footer_starter_footer_component__["a" /* StarterFooterComponent */],
                __WEBPACK_IMPORTED_MODULE_10__starter_starter_control_sidebar_starter_control_sidebar_component__["a" /* StarterControlSidebarComponent */],
                __WEBPACK_IMPORTED_MODULE_11__home_home_component__["a" /* HomeComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_1__app_routing_app_routing_module__["a" /* AppRoutingModule */],
                __WEBPACK_IMPORTED_MODULE_0__admin_admin_module__["a" /* AdminModule */],
                __WEBPACK_IMPORTED_MODULE_12_ng2_parallaxscroll__["a" /* ParallaxScrollModule */]
            ],
            providers: [],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "../../../../../src/app/home/home.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/home/home.component.html":
/***/ (function(module, exports) {

module.exports = "<!-- <p>\n  home works!\n\n  <a routerLink=\"/starter\" routerLinkActive=\"active\">starter</a>\n</p> -->\n<!-- <link rel=\"stylesheet\" href=\"../../assets/scss/style.css\">\n<link rel=\"stylesheet\" href=\"../../assets/css/main.css\"> -->\n\n<!-- <link rel=\"stylesheet\" href=\"../../assets/css/normalize.css\">\n<link rel=\"stylesheet\" href=\"../../assets/css/font-awesome.min.css\">\n<link rel=\"stylesheet\" href=\"../../assets/css/themify-icons.css\">\n<link rel=\"stylesheet\" href=\"../../assets/css/flag-icon.min.css\">\n<link rel=\"stylesheet\" href=\"../../assets/css/cs-skin-elastic.css\"> -->\n\n<!-- <link rel=\"stylesheet\" href=\"../../assets/scss/style.css\"> -->\n<link rel=\"stylesheet\" href=\"../../assets/css/main.css\">\n\n<style>\n\t.header-nav .login-form[_ngcontent-c1] .btn[_ngcontent-c1] {\n\t\tpadding: 6px;\n\t}\n\n\t.header-nav .dropdown-menu {\n\t\tmin-width: 300px;\n\t\t-webkit-box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.5);\n\t\t-moz-box-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.5);\n\t\tbox-shadow: 0px 0px 25px 0px rgba(0, 0, 0, 0.5);\n\t}\n\n\t.header-nav .dropdown-menu .checkbox label {\n\t\tline-height: 12px;\n\t}\n\n\t.move-left {\n\t\tposition: absolute;\n\t\tright: 0;\n\t\tleft: auto;\n\t}\n\n\t.main-bg-parallax {\n\t\tbackground-image: url('assets/img/paralax-bg.jpg');\n\t\tbackground-size: 100% !important;\n\t\theight: 100% !important;\n\t\twidth: 100%;\n\t}\n\n\t.contact-bg-parallax {\n\t\tbackground-image: url('assets/img/contact-page.png');\n\t\tbackground-size: 100%;\n\t\theight: 100%;\n\t\twidth: 100%;\n\t}\n</style>\n\n<!-- <script src=\"../../assets/js/parallax.min.js\"></script>\n<script src=\"../../assets/js/main.js\"></script>\n<script src=\"../../assets/js/site.js\"></script> -->\n\n<header class=\"evolvechain-header\">\n\t<div class=\"container\">\n\t\t<div class=\"row\">\n\t\t\t<div class=\"col-sm-2\">\n\t\t\t\t<div class=\"evolvechain-logo\">\n\t\t\t\t\t<a href=\"#\">\n\t\t\t\t\t\t<img src=\"assets/img/Logo2.jpg\" alt=\"\" />\n\t\t\t\t\t\t<strong>EvolveChain</strong>\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<!-- <div class=\"navbar-custom-menu\">\n\t\t\t\t\t<ul class=\"nav navbar-nav\"> -->\n\t\t\t<div class=\"col-sm-10 offset-sm-5 text-right\">\n\t\t\t\t<nav class=\"header-nav\">\n\t\t\t\t\t<ul nav navbar-nav>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<a href=\"#about\">About Us</a>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t<a href=\"#contact\">Contact Us</a>\n\t\t\t\t\t\t</li>\n\n\t\t\t\t\t\t<li class=\"dropdown user user-menu\">\n\t\t\t\t\t\t\t<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n\t\t\t\t\t\t\t\t<span class=\"hidden-xs\">Log In</span>\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t<ul class=\"dropdown-menu move-left\">\n\n\t\t\t\t\t\t\t\t<div class=\"login-form login-form-wrapper\">\n\t\t\t\t\t\t\t\t\t<div class=\"login-logo popup-login-logo\">\n\t\t\t\t\t\t\t\t\t\t<a href=\"index.html\">\n\t\t\t\t\t\t\t\t\t\t\t<img class=\"align-content\" src=\"assets/img/Logo2.jpg\" alt=\"\">\n\t\t\t\t\t\t\t\t\t\t\t<strong>EvolveChain</strong>\n\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<form>\n\t\t\t\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t\t\t\t<input type=\"email\" class=\"form-control\" placeholder=\"Email\">\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"form-group\">\n\t\t\t\t\t\t\t\t\t\t\t<input type=\"password\" class=\"form-control\" placeholder=\"Password\">\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<div class=\"checkbox\">\n\t\t\t\t\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t\t\t\t\t<input type=\"checkbox\"> Remember Me\n\t\t\t\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t<button type=\"button\" class=\"btn  button-blue btn-flat m-b-30 m-t-30\" (click)=\"LoginBtnClick()\">Log in</button>\n\n\t\t\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t\t\t</div>\n\n\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t</ul>\n\t\t\t\t</nav>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</header>\n<div class=\"banner-section parallax-window\" parallax class=\"main-bg-parallax\" [config]=\"{axis: y, speed: .5}\">\n\t<div class=\"banner-content-cover\">\n\t\t<div class=\"banner-content\">\n\t\t\t<div class=\"container text-center banner-container\">\n\t\t\t\t<h1>Welcome To EvolveChain</h1>\n\t\t\t\t<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard\n\t\t\t\t\tdummy text ever since the 1500s.</p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n<div id=\"about\" class=\"about-us\">\n\t<div class=\"container\">\n\t\t<div class=\"row\">\n\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t<div class=\"about-us-img\">\n\t\t\t\t\t<img src=\"assets/img/about_us2.jpg\" alt=\"\" />\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t<div class=\"about-content\">\n\t\t\t\t\t<h2>What we are</h2>\n\t\t\t\t\t<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard\n\t\t\t\t\t\tdummy text ever since the 1500s.Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum\n\t\t\t\t\t\thas been the industry's standard dummy text ever since the 1500s.</p>\n\t\t\t\t\t<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard\n\t\t\t\t\t\tdummy text ever since the 1500s.</p>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n<div id=\"contact\" class=\"about-us contact-us parallax-window\" parallax class=\"contact-bg-parallax\" data-image-src=\"assets/img/contact-page.png\"\n data-speed=\"0.1\">\n\t<div class=\"container\">\n\t\t<div class=\"row\">\n\n\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t<div class=\"about-content banner-content\">\n\t\t\t\t\t<h2>Contact Us</h2>\n\t\t\t\t\t<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard\n\t\t\t\t\t\tdummy text ever since the 1500s.</p>\n\t\t\t\t\t<address>\n\t\t\t\t\t\tEvolveChain Evolution Inc\n\t\t\t\t\t\t<br/> 100 King Street West, Suite 5700\n\t\t\t\t\t\t<br/> Toronto, Ontario, M5X 1C7\n\t\t\t\t\t\t<br/> Tel: (647) 931 – 9768\n\t\t\t\t\t\t<br/> Fax: 99113388\n\t\t\t\t\t</address>\n\t\t\t\t\t<!-- <div class=\"contact-form-wrapper\">\n\t\t\t\t\t\t\t\t<form>\n\t\t\t\t\t\t\t\t\t<input type=\"text\" placeholder=\"Name...\">\n\t\t\t\t\t\t\t\t\t<input type=\"text\" placeholder=\"Email...\">\n\t\t\t\t\t\t\t\t\t<input type=\"submit\" value=\"submit\" />\n\t\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t\t</div> -->\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t<div class=\"text-center\">\n\t\t\t\t\t<!-- <img src=\"images/location.png\" alt=\"\" /> -->\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n<footer class=\"evolvechain-footer\">\n\t<div class=\"container\">\n\t\t<div class=\"row\">\n\t\t\t<div class=\"col-sm-6\">\n\t\t\t\t<div class=\"copyright\">\n\t\t\t\t\t<span>© EvolveChain 2018</span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"col-sm-6 text-right\">\n\t\t\t\t<div class=\"app-icon\">\n\t\t\t\t\t<span>Download Our App: </span>\n\t\t\t\t\t<a href=\"\">\n\t\t\t\t\t\t<img src=\"assets/img/apple.png\" alt=\"\" />\n\t\t\t\t\t</a>\n\t\t\t\t\t<a href=\"\">\n\t\t\t\t\t\t<img src=\"assets/img/android.png\" alt=\"\" />\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t</div>\n\t</div>\n</footer>"

/***/ }),

/***/ "../../../../../src/app/home/home.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/esm5/router.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var HomeComponent = (function () {
    function HomeComponent(router) {
        this.router = router;
    }
    HomeComponent.prototype.ngOnInit = function () {
    };
    HomeComponent.prototype.LoginBtnClick = function () {
        //alert("Login Clicked");
        //this.router.navigate(['/admin/dashboard1']);
        this.router.navigateByUrl('/admin');
    };
    HomeComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-home',
            template: __webpack_require__("../../../../../src/app/home/home.component.html"),
            styles: [__webpack_require__("../../../../../src/app/home/home.component.css")]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]])
    ], HomeComponent);
    return HomeComponent;
}());



/***/ }),

/***/ "../../../../../src/app/starter/starter-content/starter-content.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/starter/starter-content/starter-content.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"content-wrapper\">\n  <!-- Content Header (Page header) -->\n  <section class=\"content-header\">\n    <h1>\n      Page Header\n      <small>Optional description</small>\n    </h1>\n    <ol class=\"breadcrumb\">\n      <li><a href=\"#\"><i class=\"fa fa-dashboard\"></i> Level</a></li>\n      <li class=\"active\">Here</li>\n    </ol>\n  </section>\n\n  <!-- Main content -->\n  <section class=\"content\">\n\n    <!-- Your Page Content Here -->\n\n  </section>\n  <!-- /.content -->\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/starter/starter-content/starter-content.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StarterContentComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var StarterContentComponent = (function () {
    function StarterContentComponent() {
    }
    StarterContentComponent.prototype.ngOnInit = function () {
        // Update the AdminLTE layouts
        AdminLTE.init();
    };
    StarterContentComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-starter-content',
            template: __webpack_require__("../../../../../src/app/starter/starter-content/starter-content.component.html"),
            styles: [__webpack_require__("../../../../../src/app/starter/starter-content/starter-content.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], StarterContentComponent);
    return StarterContentComponent;
}());



/***/ }),

/***/ "../../../../../src/app/starter/starter-control-sidebar/starter-control-sidebar.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/starter/starter-control-sidebar/starter-control-sidebar.component.html":
/***/ (function(module, exports) {

module.exports = "<aside class=\"control-sidebar control-sidebar-dark\">\n  <!-- Create the tabs -->\n  <ul class=\"nav nav-tabs nav-justified control-sidebar-tabs\">\n    <li class=\"active\"><a href=\"#control-sidebar-home-tab\" data-toggle=\"tab\"><i class=\"fa fa-home\"></i></a></li>\n    <li><a href=\"#control-sidebar-settings-tab\" data-toggle=\"tab\"><i class=\"fa fa-gears\"></i></a></li>\n  </ul>\n  <!-- Tab panes -->\n  <div class=\"tab-content\">\n    <!-- Home tab content -->\n    <div class=\"tab-pane active\" id=\"control-sidebar-home-tab\">\n      <h3 class=\"control-sidebar-heading\">Recent Activity</h3>\n      <ul class=\"control-sidebar-menu\">\n        <li>\n          <a href=\"javascript:;\">\n              <i class=\"menu-icon fa fa-birthday-cake bg-red\"></i>\n\n              <div class=\"menu-info\">\n                <h4 class=\"control-sidebar-subheading\">Langdon's Birthday</h4>\n\n                <p>Will be 23 on April 24th</p>\n              </div>\n            </a>\n        </li>\n      </ul>\n      <!-- /.control-sidebar-menu -->\n\n      <h3 class=\"control-sidebar-heading\">Tasks Progress</h3>\n      <ul class=\"control-sidebar-menu\">\n        <li>\n          <a href=\"javascript:;\">\n            <h4 class=\"control-sidebar-subheading\">\n              Custom Template Design\n              <span class=\"pull-right-container\">\n                  <span class=\"label label-danger pull-right\">70%</span>\n              </span>\n            </h4>\n\n            <div class=\"progress progress-xxs\">\n              <div class=\"progress-bar progress-bar-danger\" style=\"width: 70%\"></div>\n            </div>\n          </a>\n        </li>\n      </ul>\n      <!-- /.control-sidebar-menu -->\n\n    </div>\n    <!-- /.tab-pane -->\n    <!-- Stats tab content -->\n    <div class=\"tab-pane\" id=\"control-sidebar-stats-tab\">Stats Tab Content</div>\n    <!-- /.tab-pane -->\n    <!-- Settings tab content -->\n    <div class=\"tab-pane\" id=\"control-sidebar-settings-tab\">\n      <form method=\"post\">\n        <h3 class=\"control-sidebar-heading\">General Settings</h3>\n\n        <div class=\"form-group\">\n          <label class=\"control-sidebar-subheading\">\n              Report panel usage\n              <input type=\"checkbox\" class=\"pull-right\" checked>\n            </label>\n\n          <p>\n            Some information about this general settings option\n          </p>\n        </div>\n        <!-- /.form-group -->\n      </form>\n    </div>\n    <!-- /.tab-pane -->\n  </div>\n</aside>\n"

/***/ }),

/***/ "../../../../../src/app/starter/starter-control-sidebar/starter-control-sidebar.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StarterControlSidebarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var StarterControlSidebarComponent = (function () {
    function StarterControlSidebarComponent() {
    }
    StarterControlSidebarComponent.prototype.ngOnInit = function () {
    };
    StarterControlSidebarComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-starter-control-sidebar',
            template: __webpack_require__("../../../../../src/app/starter/starter-control-sidebar/starter-control-sidebar.component.html"),
            styles: [__webpack_require__("../../../../../src/app/starter/starter-control-sidebar/starter-control-sidebar.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], StarterControlSidebarComponent);
    return StarterControlSidebarComponent;
}());



/***/ }),

/***/ "../../../../../src/app/starter/starter-footer/starter-footer.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/starter/starter-footer/starter-footer.component.html":
/***/ (function(module, exports) {

module.exports = "<footer class=\"main-footer\">\n  <!-- To the right -->\n  <div class=\"pull-right hidden-xs\">\n    Anything you want\n  </div>\n  <!-- Default to the left -->\n  <strong>Copyright &copy; 2016 <a href=\"#\">Company</a>.</strong> All rights reserved.\n</footer>\n"

/***/ }),

/***/ "../../../../../src/app/starter/starter-footer/starter-footer.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StarterFooterComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var StarterFooterComponent = (function () {
    function StarterFooterComponent() {
    }
    StarterFooterComponent.prototype.ngOnInit = function () {
    };
    StarterFooterComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-starter-footer',
            template: __webpack_require__("../../../../../src/app/starter/starter-footer/starter-footer.component.html"),
            styles: [__webpack_require__("../../../../../src/app/starter/starter-footer/starter-footer.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], StarterFooterComponent);
    return StarterFooterComponent;
}());



/***/ }),

/***/ "../../../../../src/app/starter/starter-header/starter-header.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/starter/starter-header/starter-header.component.html":
/***/ (function(module, exports) {

module.exports = "<header class=\"main-header\">\n\n  <!-- Logo -->\n  <a href=\"#\" class=\"logo\">\n    <!-- mini logo for sidebar mini 50x50 pixels -->\n    <span class=\"logo-mini\"><b>A</b>LT</span>\n    <!-- logo for regular state and mobile devices -->\n    <span class=\"logo-lg\"><b>Admin</b>LTE</span>\n  </a>\n\n  <!-- Header Navbar -->\n  <nav class=\"navbar navbar-static-top\" role=\"navigation\">\n    <!-- Sidebar toggle button-->\n    <a href=\"#\" class=\"sidebar-toggle\" data-toggle=\"offcanvas\" role=\"button\">\n        <span class=\"sr-only\">Toggle navigation</span>\n      </a>\n    <!-- Navbar Right Menu -->\n    <div class=\"navbar-custom-menu\">\n      <ul class=\"nav navbar-nav\">\n        <!-- Messages: style can be found in dropdown.less-->\n        <li class=\"dropdown messages-menu\">\n          <!-- Menu toggle button -->\n          <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n              <i class=\"fa fa-envelope-o\"></i>\n              <span class=\"label label-success\">4</span>\n            </a>\n          <ul class=\"dropdown-menu\">\n            <li class=\"header\">You have 4 messages</li>\n            <li>\n              <!-- inner menu: contains the messages -->\n              <ul class=\"menu\">\n                <li>\n                  <!-- start message -->\n                  <a href=\"#\">\n                    <div class=\"pull-left\">\n                      <!-- User Image -->\n                      <img src=\"assets/img/user2-160x160.jpg\" class=\"img-circle\" alt=\"User Image\">\n                    </div>\n                    <!-- Message title and timestamp -->\n                    <h4>\n                      Support Team\n                      <small><i class=\"fa fa-clock-o\"></i> 5 mins</small>\n                    </h4>\n                    <!-- The message -->\n                    <p>Why not buy a new awesome theme?</p>\n                  </a>\n                </li>\n                <!-- end message -->\n              </ul>\n              <!-- /.menu -->\n            </li>\n            <li class=\"footer\"><a href=\"#\">See All Messages</a></li>\n          </ul>\n        </li>\n        <!-- /.messages-menu -->\n\n        <!-- Notifications Menu -->\n        <li class=\"dropdown notifications-menu\">\n          <!-- Menu toggle button -->\n          <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n              <i class=\"fa fa-bell-o\"></i>\n              <span class=\"label label-warning\">10</span>\n            </a>\n          <ul class=\"dropdown-menu\">\n            <li class=\"header\">You have 10 notifications</li>\n            <li>\n              <!-- Inner Menu: contains the notifications -->\n              <ul class=\"menu\">\n                <li>\n                  <!-- start notification -->\n                  <a href=\"#\">\n                      <i class=\"fa fa-users text-aqua\"></i> 5 new members joined today\n                    </a>\n                </li>\n                <!-- end notification -->\n              </ul>\n            </li>\n            <li class=\"footer\"><a href=\"#\">View all</a></li>\n          </ul>\n        </li>\n        <!-- Tasks Menu -->\n        <li class=\"dropdown tasks-menu\">\n          <!-- Menu Toggle Button -->\n          <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n              <i class=\"fa fa-flag-o\"></i>\n              <span class=\"label label-danger\">9</span>\n            </a>\n          <ul class=\"dropdown-menu\">\n            <li class=\"header\">You have 9 tasks</li>\n            <li>\n              <!-- Inner menu: contains the tasks -->\n              <ul class=\"menu\">\n                <li>\n                  <!-- Task item -->\n                  <a href=\"#\">\n                    <!-- Task title and progress text -->\n                    <h3>\n                      Design some buttons\n                      <small class=\"pull-right\">20%</small>\n                    </h3>\n                    <!-- The progress bar -->\n                    <div class=\"progress xs\">\n                      <!-- Change the css width attribute to simulate progress -->\n                      <div class=\"progress-bar progress-bar-aqua\" style=\"width: 20%\" role=\"progressbar\" aria-valuenow=\"20\" aria-valuemin=\"0\" aria-valuemax=\"100\">\n                        <span class=\"sr-only\">20% Complete</span>\n                      </div>\n                    </div>\n                  </a>\n                </li>\n                <!-- end task item -->\n              </ul>\n            </li>\n            <li class=\"footer\">\n              <a href=\"#\">View all tasks</a>\n            </li>\n          </ul>\n        </li>\n        <!-- User Account Menu -->\n        <li class=\"dropdown user user-menu\">\n          <!-- Menu Toggle Button -->\n          <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n            <!-- The user image in the navbar-->\n            <img src=\"assets/img/user2-160x160.jpg\" class=\"user-image\" alt=\"User Image\">\n            <!-- hidden-xs hides the username on small devices so only the image appears. -->\n            <span class=\"hidden-xs\">Alexander Pierce</span>\n          </a>\n          <ul class=\"dropdown-menu\">\n            <!-- The user image in the menu -->\n            <li class=\"user-header\">\n              <img src=\"assets/img/user2-160x160.jpg\" class=\"img-circle\" alt=\"User Image\">\n\n              <p>\n                Alexander Pierce - Web Developer\n                <small>Member since Nov. 2012</small>\n              </p>\n            </li>\n            <!-- Menu Body -->\n            <li class=\"user-body\">\n              <div class=\"row\">\n                <div class=\"col-xs-4 text-center\">\n                  <a href=\"#\">Followers</a>\n                </div>\n                <div class=\"col-xs-4 text-center\">\n                  <a href=\"#\">Sales</a>\n                </div>\n                <div class=\"col-xs-4 text-center\">\n                  <a href=\"#\">Friends</a>\n                </div>\n              </div>\n              <!-- /.row -->\n            </li>\n            <!-- Menu Footer-->\n            <li class=\"user-footer\">\n              <div class=\"pull-left\">\n                <a href=\"#\" class=\"btn btn-default btn-flat\">Profile</a>\n              </div>\n              <div class=\"pull-right\">\n                <a href=\"#\" class=\"btn btn-default btn-flat\">Sign out</a>\n              </div>\n            </li>\n          </ul>\n        </li>\n        <!-- Control Sidebar Toggle Button -->\n        <li>\n          <a href=\"#\" data-toggle=\"control-sidebar\"><i class=\"fa fa-gears\"></i></a>\n        </li>\n      </ul>\n    </div>\n  </nav>\n</header>\n"

/***/ }),

/***/ "../../../../../src/app/starter/starter-header/starter-header.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StarterHeaderComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var StarterHeaderComponent = (function () {
    function StarterHeaderComponent() {
    }
    StarterHeaderComponent.prototype.ngOnInit = function () {
    };
    StarterHeaderComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-starter-header',
            template: __webpack_require__("../../../../../src/app/starter/starter-header/starter-header.component.html"),
            styles: [__webpack_require__("../../../../../src/app/starter/starter-header/starter-header.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], StarterHeaderComponent);
    return StarterHeaderComponent;
}());



/***/ }),

/***/ "../../../../../src/app/starter/starter-left-side/starter-left-side.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/starter/starter-left-side/starter-left-side.component.html":
/***/ (function(module, exports) {

module.exports = "<aside class=\"main-sidebar\">\n\n  <!-- sidebar: style can be found in sidebar.less -->\n  <section class=\"sidebar\">\n\n    <!-- Sidebar user panel (optional) -->\n    <div class=\"user-panel\">\n      <div class=\"pull-left image\">\n        <img src=\"assets/img/user2-160x160.jpg\" class=\"img-circle\" alt=\"User Image\">\n      </div>\n      <div class=\"pull-left info\">\n        <p>Alexander Pierce</p>\n        <!-- Status -->\n        <a href=\"#\"><i class=\"fa fa-circle text-success\"></i> Online</a>\n      </div>\n    </div>\n\n    <!-- search form (Optional) -->\n    <form action=\"#\" method=\"get\" class=\"sidebar-form\">\n      <div class=\"input-group\">\n        <input type=\"text\" name=\"q\" class=\"form-control\" placeholder=\"Search...\">\n        <span class=\"input-group-btn\">\n                <button type=\"submit\" name=\"search\" id=\"search-btn\" class=\"btn btn-flat\"><i class=\"fa fa-search\"></i>\n                </button>\n              </span>\n      </div>\n    </form>\n    <!-- /.search form -->\n\n    <!-- Sidebar Menu -->\n    <ul class=\"sidebar-menu\">\n      <li class=\"header\">HEADER</li>\n      <!-- Optionally, you can add icons to the links -->\n      <li class=\"active\"><a href=\"#\"><i class=\"fa fa-link\"></i> <span>Link</span></a></li>\n      <li><a href=\"#\"><i class=\"fa fa-link\"></i> <span>Another Link</span></a></li>\n      <li class=\"treeview\">\n        <a href=\"#\"><i class=\"fa fa-link\"></i> <span>Multilevel</span>\n            <span class=\"pull-right-container\">\n              <i class=\"fa fa-angle-left pull-right\"></i>\n            </span>\n          </a>\n        <ul class=\"treeview-menu\">\n          <li><a href=\"#\">Link in level 2</a></li>\n          <li><a href=\"#\">Link in level 2</a></li>\n        </ul>\n      </li>\n    </ul>\n    <!-- /.sidebar-menu -->\n  </section>\n  <!-- /.sidebar -->\n</aside>\n"

/***/ }),

/***/ "../../../../../src/app/starter/starter-left-side/starter-left-side.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StarterLeftSideComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var StarterLeftSideComponent = (function () {
    function StarterLeftSideComponent() {
    }
    StarterLeftSideComponent.prototype.ngOnInit = function () {
    };
    StarterLeftSideComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-starter-left-side',
            template: __webpack_require__("../../../../../src/app/starter/starter-left-side/starter-left-side.component.html"),
            styles: [__webpack_require__("../../../../../src/app/starter/starter-left-side/starter-left-side.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], StarterLeftSideComponent);
    return StarterLeftSideComponent;
}());



/***/ }),

/***/ "../../../../../src/app/starter/starter.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/starter/starter.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"wrapper\">\n   <!-- Main Header -->\n  <app-starter-header></app-starter-header>\n  <!-- Left side column. contains the logo and sidebar -->\n  <app-starter-left-side></app-starter-left-side>\n  <!-- Content Wrapper. Contains page content -->\n  <app-starter-content></app-starter-content>\n  <!-- /.content-wrapper -->\n  <!-- Main Footer -->\n  <app-starter-footer></app-starter-footer>\n  <!-- Control Sidebar -->\n  <app-starter-control-sidebar></app-starter-control-sidebar>\n  <!-- /.control-sidebar -->\n  <!-- Add the sidebar's background. This div must be placed\n       immediately after the control sidebar -->\n  <div class=\"control-sidebar-bg\"></div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/starter/starter.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StarterComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var StarterComponent = (function () {
    function StarterComponent() {
        this.bodyClasses = 'skin-blue sidebar-mini';
        this.body = document.getElementsByTagName('body')[0];
    }
    StarterComponent.prototype.ngOnInit = function () {
        // add the the body classes
        this.body.classList.add('skin-blue');
        this.body.classList.add('sidebar-mini');
    };
    StarterComponent.prototype.ngOnDestroy = function () {
        // remove the the body classes
        this.body.classList.remove('skin-blue');
        this.body.classList.remove('sidebar-mini');
    };
    StarterComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
            selector: 'app-starter',
            template: __webpack_require__("../../../../../src/app/starter/starter.component.html"),
            styles: [__webpack_require__("../../../../../src/app/starter/starter.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], StarterComponent);
    return StarterComponent;
}());



/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};


/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/esm5/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_13" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);


/***/ }),

/***/ "../../../../moment/locale recursive ^\\.\\/.*$":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": "../../../../moment/locale/af.js",
	"./af.js": "../../../../moment/locale/af.js",
	"./ar": "../../../../moment/locale/ar.js",
	"./ar-dz": "../../../../moment/locale/ar-dz.js",
	"./ar-dz.js": "../../../../moment/locale/ar-dz.js",
	"./ar-kw": "../../../../moment/locale/ar-kw.js",
	"./ar-kw.js": "../../../../moment/locale/ar-kw.js",
	"./ar-ly": "../../../../moment/locale/ar-ly.js",
	"./ar-ly.js": "../../../../moment/locale/ar-ly.js",
	"./ar-ma": "../../../../moment/locale/ar-ma.js",
	"./ar-ma.js": "../../../../moment/locale/ar-ma.js",
	"./ar-sa": "../../../../moment/locale/ar-sa.js",
	"./ar-sa.js": "../../../../moment/locale/ar-sa.js",
	"./ar-tn": "../../../../moment/locale/ar-tn.js",
	"./ar-tn.js": "../../../../moment/locale/ar-tn.js",
	"./ar.js": "../../../../moment/locale/ar.js",
	"./az": "../../../../moment/locale/az.js",
	"./az.js": "../../../../moment/locale/az.js",
	"./be": "../../../../moment/locale/be.js",
	"./be.js": "../../../../moment/locale/be.js",
	"./bg": "../../../../moment/locale/bg.js",
	"./bg.js": "../../../../moment/locale/bg.js",
	"./bm": "../../../../moment/locale/bm.js",
	"./bm.js": "../../../../moment/locale/bm.js",
	"./bn": "../../../../moment/locale/bn.js",
	"./bn.js": "../../../../moment/locale/bn.js",
	"./bo": "../../../../moment/locale/bo.js",
	"./bo.js": "../../../../moment/locale/bo.js",
	"./br": "../../../../moment/locale/br.js",
	"./br.js": "../../../../moment/locale/br.js",
	"./bs": "../../../../moment/locale/bs.js",
	"./bs.js": "../../../../moment/locale/bs.js",
	"./ca": "../../../../moment/locale/ca.js",
	"./ca.js": "../../../../moment/locale/ca.js",
	"./cs": "../../../../moment/locale/cs.js",
	"./cs.js": "../../../../moment/locale/cs.js",
	"./cv": "../../../../moment/locale/cv.js",
	"./cv.js": "../../../../moment/locale/cv.js",
	"./cy": "../../../../moment/locale/cy.js",
	"./cy.js": "../../../../moment/locale/cy.js",
	"./da": "../../../../moment/locale/da.js",
	"./da.js": "../../../../moment/locale/da.js",
	"./de": "../../../../moment/locale/de.js",
	"./de-at": "../../../../moment/locale/de-at.js",
	"./de-at.js": "../../../../moment/locale/de-at.js",
	"./de-ch": "../../../../moment/locale/de-ch.js",
	"./de-ch.js": "../../../../moment/locale/de-ch.js",
	"./de.js": "../../../../moment/locale/de.js",
	"./dv": "../../../../moment/locale/dv.js",
	"./dv.js": "../../../../moment/locale/dv.js",
	"./el": "../../../../moment/locale/el.js",
	"./el.js": "../../../../moment/locale/el.js",
	"./en-au": "../../../../moment/locale/en-au.js",
	"./en-au.js": "../../../../moment/locale/en-au.js",
	"./en-ca": "../../../../moment/locale/en-ca.js",
	"./en-ca.js": "../../../../moment/locale/en-ca.js",
	"./en-gb": "../../../../moment/locale/en-gb.js",
	"./en-gb.js": "../../../../moment/locale/en-gb.js",
	"./en-ie": "../../../../moment/locale/en-ie.js",
	"./en-ie.js": "../../../../moment/locale/en-ie.js",
	"./en-nz": "../../../../moment/locale/en-nz.js",
	"./en-nz.js": "../../../../moment/locale/en-nz.js",
	"./eo": "../../../../moment/locale/eo.js",
	"./eo.js": "../../../../moment/locale/eo.js",
	"./es": "../../../../moment/locale/es.js",
	"./es-do": "../../../../moment/locale/es-do.js",
	"./es-do.js": "../../../../moment/locale/es-do.js",
	"./es-us": "../../../../moment/locale/es-us.js",
	"./es-us.js": "../../../../moment/locale/es-us.js",
	"./es.js": "../../../../moment/locale/es.js",
	"./et": "../../../../moment/locale/et.js",
	"./et.js": "../../../../moment/locale/et.js",
	"./eu": "../../../../moment/locale/eu.js",
	"./eu.js": "../../../../moment/locale/eu.js",
	"./fa": "../../../../moment/locale/fa.js",
	"./fa.js": "../../../../moment/locale/fa.js",
	"./fi": "../../../../moment/locale/fi.js",
	"./fi.js": "../../../../moment/locale/fi.js",
	"./fo": "../../../../moment/locale/fo.js",
	"./fo.js": "../../../../moment/locale/fo.js",
	"./fr": "../../../../moment/locale/fr.js",
	"./fr-ca": "../../../../moment/locale/fr-ca.js",
	"./fr-ca.js": "../../../../moment/locale/fr-ca.js",
	"./fr-ch": "../../../../moment/locale/fr-ch.js",
	"./fr-ch.js": "../../../../moment/locale/fr-ch.js",
	"./fr.js": "../../../../moment/locale/fr.js",
	"./fy": "../../../../moment/locale/fy.js",
	"./fy.js": "../../../../moment/locale/fy.js",
	"./gd": "../../../../moment/locale/gd.js",
	"./gd.js": "../../../../moment/locale/gd.js",
	"./gl": "../../../../moment/locale/gl.js",
	"./gl.js": "../../../../moment/locale/gl.js",
	"./gom-latn": "../../../../moment/locale/gom-latn.js",
	"./gom-latn.js": "../../../../moment/locale/gom-latn.js",
	"./gu": "../../../../moment/locale/gu.js",
	"./gu.js": "../../../../moment/locale/gu.js",
	"./he": "../../../../moment/locale/he.js",
	"./he.js": "../../../../moment/locale/he.js",
	"./hi": "../../../../moment/locale/hi.js",
	"./hi.js": "../../../../moment/locale/hi.js",
	"./hr": "../../../../moment/locale/hr.js",
	"./hr.js": "../../../../moment/locale/hr.js",
	"./hu": "../../../../moment/locale/hu.js",
	"./hu.js": "../../../../moment/locale/hu.js",
	"./hy-am": "../../../../moment/locale/hy-am.js",
	"./hy-am.js": "../../../../moment/locale/hy-am.js",
	"./id": "../../../../moment/locale/id.js",
	"./id.js": "../../../../moment/locale/id.js",
	"./is": "../../../../moment/locale/is.js",
	"./is.js": "../../../../moment/locale/is.js",
	"./it": "../../../../moment/locale/it.js",
	"./it.js": "../../../../moment/locale/it.js",
	"./ja": "../../../../moment/locale/ja.js",
	"./ja.js": "../../../../moment/locale/ja.js",
	"./jv": "../../../../moment/locale/jv.js",
	"./jv.js": "../../../../moment/locale/jv.js",
	"./ka": "../../../../moment/locale/ka.js",
	"./ka.js": "../../../../moment/locale/ka.js",
	"./kk": "../../../../moment/locale/kk.js",
	"./kk.js": "../../../../moment/locale/kk.js",
	"./km": "../../../../moment/locale/km.js",
	"./km.js": "../../../../moment/locale/km.js",
	"./kn": "../../../../moment/locale/kn.js",
	"./kn.js": "../../../../moment/locale/kn.js",
	"./ko": "../../../../moment/locale/ko.js",
	"./ko.js": "../../../../moment/locale/ko.js",
	"./ky": "../../../../moment/locale/ky.js",
	"./ky.js": "../../../../moment/locale/ky.js",
	"./lb": "../../../../moment/locale/lb.js",
	"./lb.js": "../../../../moment/locale/lb.js",
	"./lo": "../../../../moment/locale/lo.js",
	"./lo.js": "../../../../moment/locale/lo.js",
	"./lt": "../../../../moment/locale/lt.js",
	"./lt.js": "../../../../moment/locale/lt.js",
	"./lv": "../../../../moment/locale/lv.js",
	"./lv.js": "../../../../moment/locale/lv.js",
	"./me": "../../../../moment/locale/me.js",
	"./me.js": "../../../../moment/locale/me.js",
	"./mi": "../../../../moment/locale/mi.js",
	"./mi.js": "../../../../moment/locale/mi.js",
	"./mk": "../../../../moment/locale/mk.js",
	"./mk.js": "../../../../moment/locale/mk.js",
	"./ml": "../../../../moment/locale/ml.js",
	"./ml.js": "../../../../moment/locale/ml.js",
	"./mr": "../../../../moment/locale/mr.js",
	"./mr.js": "../../../../moment/locale/mr.js",
	"./ms": "../../../../moment/locale/ms.js",
	"./ms-my": "../../../../moment/locale/ms-my.js",
	"./ms-my.js": "../../../../moment/locale/ms-my.js",
	"./ms.js": "../../../../moment/locale/ms.js",
	"./my": "../../../../moment/locale/my.js",
	"./my.js": "../../../../moment/locale/my.js",
	"./nb": "../../../../moment/locale/nb.js",
	"./nb.js": "../../../../moment/locale/nb.js",
	"./ne": "../../../../moment/locale/ne.js",
	"./ne.js": "../../../../moment/locale/ne.js",
	"./nl": "../../../../moment/locale/nl.js",
	"./nl-be": "../../../../moment/locale/nl-be.js",
	"./nl-be.js": "../../../../moment/locale/nl-be.js",
	"./nl.js": "../../../../moment/locale/nl.js",
	"./nn": "../../../../moment/locale/nn.js",
	"./nn.js": "../../../../moment/locale/nn.js",
	"./pa-in": "../../../../moment/locale/pa-in.js",
	"./pa-in.js": "../../../../moment/locale/pa-in.js",
	"./pl": "../../../../moment/locale/pl.js",
	"./pl.js": "../../../../moment/locale/pl.js",
	"./pt": "../../../../moment/locale/pt.js",
	"./pt-br": "../../../../moment/locale/pt-br.js",
	"./pt-br.js": "../../../../moment/locale/pt-br.js",
	"./pt.js": "../../../../moment/locale/pt.js",
	"./ro": "../../../../moment/locale/ro.js",
	"./ro.js": "../../../../moment/locale/ro.js",
	"./ru": "../../../../moment/locale/ru.js",
	"./ru.js": "../../../../moment/locale/ru.js",
	"./sd": "../../../../moment/locale/sd.js",
	"./sd.js": "../../../../moment/locale/sd.js",
	"./se": "../../../../moment/locale/se.js",
	"./se.js": "../../../../moment/locale/se.js",
	"./si": "../../../../moment/locale/si.js",
	"./si.js": "../../../../moment/locale/si.js",
	"./sk": "../../../../moment/locale/sk.js",
	"./sk.js": "../../../../moment/locale/sk.js",
	"./sl": "../../../../moment/locale/sl.js",
	"./sl.js": "../../../../moment/locale/sl.js",
	"./sq": "../../../../moment/locale/sq.js",
	"./sq.js": "../../../../moment/locale/sq.js",
	"./sr": "../../../../moment/locale/sr.js",
	"./sr-cyrl": "../../../../moment/locale/sr-cyrl.js",
	"./sr-cyrl.js": "../../../../moment/locale/sr-cyrl.js",
	"./sr.js": "../../../../moment/locale/sr.js",
	"./ss": "../../../../moment/locale/ss.js",
	"./ss.js": "../../../../moment/locale/ss.js",
	"./sv": "../../../../moment/locale/sv.js",
	"./sv.js": "../../../../moment/locale/sv.js",
	"./sw": "../../../../moment/locale/sw.js",
	"./sw.js": "../../../../moment/locale/sw.js",
	"./ta": "../../../../moment/locale/ta.js",
	"./ta.js": "../../../../moment/locale/ta.js",
	"./te": "../../../../moment/locale/te.js",
	"./te.js": "../../../../moment/locale/te.js",
	"./tet": "../../../../moment/locale/tet.js",
	"./tet.js": "../../../../moment/locale/tet.js",
	"./th": "../../../../moment/locale/th.js",
	"./th.js": "../../../../moment/locale/th.js",
	"./tl-ph": "../../../../moment/locale/tl-ph.js",
	"./tl-ph.js": "../../../../moment/locale/tl-ph.js",
	"./tlh": "../../../../moment/locale/tlh.js",
	"./tlh.js": "../../../../moment/locale/tlh.js",
	"./tr": "../../../../moment/locale/tr.js",
	"./tr.js": "../../../../moment/locale/tr.js",
	"./tzl": "../../../../moment/locale/tzl.js",
	"./tzl.js": "../../../../moment/locale/tzl.js",
	"./tzm": "../../../../moment/locale/tzm.js",
	"./tzm-latn": "../../../../moment/locale/tzm-latn.js",
	"./tzm-latn.js": "../../../../moment/locale/tzm-latn.js",
	"./tzm.js": "../../../../moment/locale/tzm.js",
	"./uk": "../../../../moment/locale/uk.js",
	"./uk.js": "../../../../moment/locale/uk.js",
	"./ur": "../../../../moment/locale/ur.js",
	"./ur.js": "../../../../moment/locale/ur.js",
	"./uz": "../../../../moment/locale/uz.js",
	"./uz-latn": "../../../../moment/locale/uz-latn.js",
	"./uz-latn.js": "../../../../moment/locale/uz-latn.js",
	"./uz.js": "../../../../moment/locale/uz.js",
	"./vi": "../../../../moment/locale/vi.js",
	"./vi.js": "../../../../moment/locale/vi.js",
	"./x-pseudo": "../../../../moment/locale/x-pseudo.js",
	"./x-pseudo.js": "../../../../moment/locale/x-pseudo.js",
	"./yo": "../../../../moment/locale/yo.js",
	"./yo.js": "../../../../moment/locale/yo.js",
	"./zh-cn": "../../../../moment/locale/zh-cn.js",
	"./zh-cn.js": "../../../../moment/locale/zh-cn.js",
	"./zh-hk": "../../../../moment/locale/zh-hk.js",
	"./zh-hk.js": "../../../../moment/locale/zh-hk.js",
	"./zh-tw": "../../../../moment/locale/zh-tw.js",
	"./zh-tw.js": "../../../../moment/locale/zh-tw.js"
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "../../../../moment/locale recursive ^\\.\\/.*$";

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map