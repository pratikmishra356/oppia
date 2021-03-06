// Copyright 2014 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Initialization and basic configuration for the Oppia module.
 */
// TODO(sll): Remove the check for window.GLOBALS. This check is currently
// only there so that the Karma tests run, since it looks like Karma doesn't
// 'see' the GLOBALS variable that is defined in base.html. We should fix this
// in order to make the testing and production environments match.
var oppia = angular.module(
  'oppia', [
    'ngMaterial', 'ngAnimate', 'ngAudio', 'angularAudioRecorder', 'ngSanitize',
    'ngTouch', 'ngResource', 'ui.bootstrap', 'ui.tree', 'ui.sortable',
    'infinite-scroll', 'ngJoyRide', 'ngImgCrop', 'ui.validate',
    'pascalprecht.translate', 'ngCookies', 'toastr', 'headroom', 'dndLists'
  ].concat(
    window.GLOBALS ? (window.GLOBALS.ADDITIONAL_ANGULAR_MODULES || []) : []));

for (var constantName in constants) {
  oppia.constant(constantName, constants[constantName]);
}

oppia.constant(
  'EXPLORATION_SUMMARY_DATA_URL_TEMPLATE', '/explorationsummarieshandler/data');

oppia.constant('EXPLORATION_AND_SKILL_ID_PATTERN', /^[a-zA-Z0-9_-]+$/);

// We use a slash because this character is forbidden in a state name.
oppia.constant('PLACEHOLDER_OUTCOME_DEST', '/');
oppia.constant('INTERACTION_DISPLAY_MODE_INLINE', 'inline');
oppia.constant('LOADING_INDICATOR_URL', '/activity/loadingIndicator.gif');
oppia.constant('OBJECT_EDITOR_URL_PREFIX', '/object_editor_template/');
// Feature still in development.
// NOTE TO DEVELOPERS: This should be synchronized with the value in feconf.
oppia.constant('ENABLE_ML_CLASSIFIERS', false);
// Feature still in development.
oppia.constant('INFO_MESSAGE_SOLUTION_IS_INVALID_FOR_EXPLORATION',
  'The current solution does not lead to another card.');
oppia.constant('INFO_MESSAGE_SOLUTION_IS_INVALID_FOR_QUESTION',
  'The current solution does not correspond to a correct answer.');
oppia.constant('INFO_MESSAGE_SOLUTION_IS_VALID',
  'The solution is now valid!');
oppia.constant('INFO_MESSAGE_SOLUTION_IS_INVALID_FOR_CURRENT_RULE',
  'The current solution is no longer valid.');
oppia.constant('PARAMETER_TYPES', {
  REAL: 'Real',
  UNICODE_STRING: 'UnicodeString'
});
oppia.constant('ACTION_ACCEPT_SUGGESTION', 'accept');
oppia.constant('ACTION_REJECT_SUGGESTION', 'reject');

// The maximum number of nodes to show in a row of the state graph.
oppia.constant('MAX_NODES_PER_ROW', 4);
// The following variable must be at least 3. It represents the maximum length,
// in characters, for the name of each node label in the state graph.
oppia.constant('MAX_NODE_LABEL_LENGTH', 15);

// If an $http request fails with the following error codes, a warning is
// displayed.
oppia.constant('FATAL_ERROR_CODES', [400, 401, 404, 500]);

// Do not modify these, for backwards-compatibility reasons.
oppia.constant('COMPONENT_NAME_CONTENT', 'content');
oppia.constant('COMPONENT_NAME_HINT', 'hint');
oppia.constant('COMPONENT_NAME_SOLUTION', 'solution');
oppia.constant('COMPONENT_NAME_FEEDBACK', 'feedback');
oppia.constant('COMPONENT_NAME_DEFAULT_OUTCOME', 'default_outcome');
oppia.constant('COMPONENT_NAME_EXPLANATION', 'explanation');
oppia.constant('COMPONENT_NAME_WORKED_EXAMPLE', 'worked_example');

// Enables recording playthroughs from learner sessions.
oppia.constant('CURRENT_ACTION_SCHEMA_VERSION', 1);
oppia.constant('CURRENT_ISSUE_SCHEMA_VERSION', 1);
oppia.constant('EARLY_QUIT_THRESHOLD_IN_SECS', 45);
oppia.constant('NUM_INCORRECT_ANSWERS_THRESHOLD', 3);
oppia.constant('NUM_REPEATED_CYCLES_THRESHOLD', 3);
oppia.constant('MAX_PLAYTHROUGHS_FOR_ISSUE', 5);

oppia.constant('ACTION_TYPE_EXPLORATION_START', 'ExplorationStart');
oppia.constant('ACTION_TYPE_ANSWER_SUBMIT', 'AnswerSubmit');
oppia.constant('ACTION_TYPE_EXPLORATION_QUIT', 'ExplorationQuit');

oppia.constant('ISSUE_TYPE_EARLY_QUIT', 'EarlyQuit');
oppia.constant(
  'ISSUE_TYPE_MULTIPLE_INCORRECT_SUBMISSIONS', 'MultipleIncorrectSubmissions');
oppia.constant('ISSUE_TYPE_CYCLIC_STATE_TRANSITIONS', 'CyclicStateTransitions');
oppia.constant('SITE_NAME', 'Oppia.org');

oppia.constant('DEFAULT_PROFILE_IMAGE_PATH', '/avatar/user_blue_72px.png');

// Whether to enable the promo bar functionality. This does not actually turn on
// the promo bar, as that is gated by a config value (see config_domain). This
// merely avoids checking for whether the promo bar is enabled for every Oppia
// page visited.
oppia.constant('ENABLE_PROMO_BAR', true);

// Dynamically generate CKEditor widgets for the rich text components.
oppia.run([
  '$timeout', '$compile', '$rootScope', '$uibModal', 'RteHelperService',
  'HtmlEscaperService',
  function($timeout, $compile, $rootScope, $uibModal, RteHelperService,
      HtmlEscaperService) {
    var _RICH_TEXT_COMPONENTS = RteHelperService.getRichTextComponents();
    _RICH_TEXT_COMPONENTS.forEach(function(componentDefn) {
      // The name of the CKEditor widget corresponding to this component.
      var ckName = 'oppia' + componentDefn.id;

      // Check to ensure that a plugin is not registered more than once.
      if (CKEDITOR.plugins.registered[ckName] !== undefined) {
        return;
      }
      var tagName = 'oppia-noninteractive-' + componentDefn.id;
      var customizationArgSpecs = componentDefn.customizationArgSpecs;
      var isInline = RteHelperService.isInlineComponent(componentDefn.id);

      // Inline components will be wrapped in a span, while block components
      // will be wrapped in a div.
      if (isInline) {
        var componentTemplate = '<span type="' + tagName + '">' +
                                '<' + tagName + '></' + tagName + '>' +
                                '</span>';
      } else {
        var componentTemplate = '<div class="oppia-rte-component-container" ' +
                                'type="' + tagName + '">' +
                                '<' + tagName + '></' + tagName + '>' +
                                '<div class="component-overlay"></div>' +
                                '</div>';
      }
      CKEDITOR.plugins.add(ckName, {
        init: function(editor) {
          // Create the widget itself.
          editor.widgets.add(ckName, {
            button: componentDefn.tooltip,
            inline: isInline,
            template: componentTemplate,
            draggable: false,
            edit: function(event) {
              editor.fire('lockSnapshot', {
                dontUpdate: true
              });
              // Prevent default action since we are using our own edit modal.
              event.cancel();
              // Save this for creating the widget later.
              var container = this.wrapper.getParent(true);
              var that = this;
              var customizationArgs = {};
              customizationArgSpecs.forEach(function(spec) {
                customizationArgs[spec.name] = that.data[spec.name] ||
                                               spec.default_value;
              });

              RteHelperService._openCustomizationModal(
                customizationArgSpecs,
                customizationArgs,
                function(customizationArgsDict) {
                  for (var arg in customizationArgsDict) {
                    if (customizationArgsDict.hasOwnProperty(arg)) {
                      that.setData(arg, customizationArgsDict[arg]);
                    }
                  }
                  /**
                  * This checks whether the widget has already been inited
                  * and set up before (if we are editing a widget that
                  * has already been inserted into the RTE, we do not
                  * need to finalizeCreation again).
                  */
                  if (!that.isReady()) {
                    // Actually create the widget, if we have not already.
                    editor.widgets.finalizeCreation(container);
                  }

                  /**
                   * Need to manually $compile so the directive renders.
                   * Note that.element.$ is the native DOM object
                   * represented by that.element. See:
                   * http://docs.ckeditor.com/#!/api/CKEDITOR.dom.element
                   */
                  $compile($(that.element.$).contents())($rootScope);
                  // $timeout ensures we do not take the undo snapshot until
                  // after angular finishes its changes to the component tags.
                  $timeout(function() {
                    // For inline widgets, place the caret after the
                    // widget so the user can continue typing immediately.
                    if (isInline) {
                      var range = editor.createRange();
                      var widgetContainer = that.element.getParent();
                      range.moveToPosition(
                        widgetContainer, CKEDITOR.POSITION_AFTER_END);
                      editor.getSelection().selectRanges([range]);
                      // Another timeout needed so the undo snapshot is
                      // not taken until the caret is in the right place.
                      $timeout(function() {
                        editor.fire('unlockSnapshot');
                        editor.fire('saveSnapshot');
                      });
                    } else {
                      editor.fire('unlockSnapshot');
                      editor.fire('saveSnapshot');
                    }
                  });
                },
                function() {},
                function() {});
            },
            /**
             * This is how the widget will be represented in the outputs source,
             * so it is called when we call editor.getData().
             */
            downcast: function(element) {
              // Clear the angular rendering content, which we don't
              // want in the output.
              element.children[0].setHtml('');
              // Return just the rich text component, without its wrapper.
              return element.children[0];
            },
            /**
             * This is how a widget is recognized by CKEditor, for example
             * when we first load data in. Returns a boolean,
             * true iff "element" is an instance of this widget.
             */
            upcast: function(element) {
              return (element.name !== 'p' &&
                      element.children.length > 0 &&
                      element.children[0].name === tagName);
            },
            data: function() {
              var that = this;
              // Set attributes of component according to data values.
              customizationArgSpecs.forEach(function(spec) {
                that.element.getChild(0).setAttribute(
                  spec.name + '-with-value',
                  HtmlEscaperService.objToEscapedJson(
                    that.data[spec.name] || ''));
              });
            },
            init: function() {
              editor.fire('lockSnapshot', {
                dontUpdate: true
              });
              var that = this;
              var isMissingAttributes = false;
              // On init, read values from component attributes and save them.
              customizationArgSpecs.forEach(function(spec) {
                var value = that.element.getChild(0).getAttribute(
                  spec.name + '-with-value');
                if (value) {
                  that.setData(
                    spec.name, HtmlEscaperService.escapedJsonToObj(value));
                } else {
                  isMissingAttributes = true;
                }
              });

              if (!isMissingAttributes) {
                // Need to manually $compile so the directive renders.
                $compile($(this.element.$).contents())($rootScope);
              }
              $timeout(function() {
                editor.fire('unlockSnapshot');
                editor.fire('saveSnapshot');
              });
            }
          });
        }
      });
    });
  }
]);

oppia.config([
  '$compileProvider', '$httpProvider', '$interpolateProvider',
  '$locationProvider', '$cookiesProvider',
  function(
      $compileProvider, $httpProvider, $interpolateProvider,
      $locationProvider, $cookiesProvider) {
    // This improves performance by disabling debug data. For more details,
    // see https://code.angularjs.org/1.5.5/docs/guide/production
    $compileProvider.debugInfoEnabled(false);

    // Set the AngularJS interpolators as <[ and ]>, to not conflict with
    // Jinja2 templates.
    $interpolateProvider.startSymbol('<[');
    $interpolateProvider.endSymbol(']>');

    // Prevent the search page from reloading if the search query is changed.
    $locationProvider.html5Mode(false);
    if (window.location.pathname === '/search/find') {
      $locationProvider.html5Mode(true);
    }

    // Prevent storing duplicate cookies for translation language.
    $cookiesProvider.defaults.path = '/';

    // Set default headers for POST and PUT requests.
    $httpProvider.defaults.headers.post = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    $httpProvider.defaults.headers.put = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    // Add an interceptor to convert requests to strings and to log and show
    // warnings for error responses.
    $httpProvider.interceptors.push([
      '$q', '$log', 'AlertsService', function($q, $log, AlertsService) {
        return {
          request: function(config) {
            if (config.data) {
              config.data = $.param({
                csrf_token: GLOBALS.csrf_token,
                payload: JSON.stringify(config.data),
                source: document.URL
              }, true);
            }
            return config;
          },
          responseError: function(rejection) {
            // A rejection status of -1 seems to indicate (it's hard to find
            // documentation) that the response has not completed,
            // which can occur if the user navigates away from the page
            // while the response is pending, This should not be considered
            // an error.
            if (rejection.status !== -1) {
              $log.error(rejection.data);

              var warningMessage = 'Error communicating with server.';
              if (rejection.data && rejection.data.error) {
                warningMessage = rejection.data.error;
              }
              AlertsService.addWarning(warningMessage);
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);

oppia.config(['$provide', function($provide) {
  $provide.decorator('$log', ['$delegate', 'DEV_MODE',
    function($delegate, DEV_MODE) {
      var _originalError = $delegate.error;

      if (!DEV_MODE) {
        $delegate.log = function() {};
        $delegate.info = function() {};
        // TODO(sll): Send errors (and maybe warnings) to the backend.
        $delegate.warn = function() { };
        $delegate.error = function(message) {
          if (String(message).indexOf('$digest already in progress') === -1) {
            _originalError(message);
          }
        };
        // This keeps angular-mocks happy (in tests).
        $delegate.error.logs = [];
      }

      return $delegate;
    }
  ]);
}]);

oppia.config(['toastrConfig', function(toastrConfig) {
  angular.extend(toastrConfig, {
    allowHtml: false,
    iconClasses: {
      error: 'toast-error',
      info: 'toast-info',
      success: 'toast-success',
      warning: 'toast-warning'
    },
    positionClass: 'toast-bottom-right',
    messageClass: 'toast-message',
    progressBar: false,
    tapToDismiss: true,
    titleClass: 'toast-title'
  });
}]);

oppia.config(['recorderServiceProvider', function(recorderServiceProvider) {
  recorderServiceProvider.forceSwf(false);
  recorderServiceProvider.withMp3Conversion(true, {
    bitRate: 128
  });
}]);

// Overwrite the built-in exceptionHandler service to log errors to the backend
// (so that they can be fixed).
oppia.factory('$exceptionHandler', ['$log', function($log) {
  var MIN_TIME_BETWEEN_ERRORS_MSEC = 5000;
  var timeOfLastPostedError = Date.now() - MIN_TIME_BETWEEN_ERRORS_MSEC;

  return function(exception, cause) {
    var messageAndSourceAndStackTrace = [
      '',
      'Cause: ' + cause,
      exception.message,
      String(exception.stack),
      '    at URL: ' + window.location.href
    ].join('\n');

    // To prevent an overdose of errors, throttle to at most 1 error every
    // MIN_TIME_BETWEEN_ERRORS_MSEC.
    if (Date.now() - timeOfLastPostedError > MIN_TIME_BETWEEN_ERRORS_MSEC) {
      // Catch all errors, to guard against infinite recursive loops.
      try {
        // We use jQuery here instead of Angular's $http, since the latter
        // creates a circular dependency.
        $.ajax({
          type: 'POST',
          url: '/frontend_errors',
          data: $.param({
            csrf_token: GLOBALS.csrf_token,
            payload: JSON.stringify({
              error: messageAndSourceAndStackTrace
            }),
            source: document.URL
          }, true),
          contentType: 'application/x-www-form-urlencoded',
          dataType: 'text',
          async: true
        });

        timeOfLastPostedError = Date.now();
      } catch (loggingError) {
        $log.warn('Error logging failed.');
      }
    }

    $log.error.apply($log, arguments);
  };
}]);

oppia.constant('LABEL_FOR_CLEARING_FOCUS', 'labelForClearingFocus');

// Add a String.prototype.trim() polyfill for IE8.
if (typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

// Add an Object.create() polyfill for IE8.
if (typeof Object.create !== 'function') {
  (function() {
    var F = function() {};
    Object.create = function(o) {
      if (arguments.length > 1) {
        throw Error('Second argument for Object.create() is not supported');
      }
      if (o === null) {
        throw Error('Cannot set a null [[Prototype]]');
      }
      if (typeof o !== 'object') {
        throw TypeError('Argument must be an object');
      }
      F.prototype = o;
      return new F();
    };
  })();
}

// Add a Number.isInteger() polyfill for IE.
Number.isInteger = Number.isInteger || function(value) {
  return (
    typeof value === 'number' && isFinite(value) &&
    Math.floor(value) === value);
};
