'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

require('angular-mocks');

var _chai = require('chai');

var _ngreact = require('ngreact');

var _ngreact2 = _interopRequireDefault(_ngreact);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _angularTemplate = require('./angularTemplate');

var _angularTemplate2 = _interopRequireDefault(_angularTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_angular2.default.module('testAngularTemplate', [_ngreact2.default.name, (0, _angularTemplate.reactAngularModule)().name]).config(function ($compileProvider) {
  return $compileProvider.debugInfoEnabled(false);
}).value('Component', null).decorator('Component', function ($delegate) {
  return _angular2.default.module('testAngularTemplate').Component;
}).directive('plop', function () {
  return {
    restrict: 'E',
    template: '<div class="plop"></div>'
  };
}).directive('simpleTemplateDirective', function () {
  return {
    restrict: 'E',
    template: '<div class="simple"></div>'
  };
}).directive('transcludeDirective', function () {
  return {
    restrict: 'E',
    transclude: true,
    template: '<div class="transclude"><div class="one">plop</div><div class="two" ng-transclude></div></div>'
  };
}).directive('replaceDirective', function () {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="replace"></div>'
  };
}).directive('ngReactDirective', function (reactDirective) {
  var SomeReact = function SomeReact(props) {
    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(
        'span',
        { className: 'toto' },
        props.toto
      ),
      props.component()
    );
  };
  SomeReact.propTypes = { toto: _propTypes2.default.string, component: _propTypes2.default.func };

  return reactDirective(SomeReact);
}).directive('manualReact', function () {
  return {
    restrict: 'E',
    scope: {
      props: '&'
    },
    link: function link($scope, $element) {
      _reactDom2.default.render(_react2.default.createElement(_angular2.default.module('testAngularTemplate').Component, _extends({}, $scope.props(), {
        $scope: $scope
      })), $element[0]);
    }
  };
});

describe('AngularTemplate', function () {
  var $compile = void 0;
  var $rootScope = void 0;
  var $container = void 0;

  beforeEach(_angular2.default.mock.module('testAngularTemplate'));
  beforeEach(_angular2.default.mock.inject(function ($injector, $document) {
    $container = _angular2.default.element('<div></div>');
    $container.data('$injector', $injector);
    $document.append($container);
  }));
  beforeEach(_angular2.default.mock.inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));
  afterEach(function () {
    $container.remove();
  });

  var compile = function compile(Component) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _angular2.default.module('testAngularTemplate').Component = Component;
    $rootScope.props = props;

    var element = $compile('<react-component name="Component" props="props"></react-component>')($rootScope, function (clone) {
      $container.append(clone);
    });
    $rootScope.$digest();

    return element.children();
  };

  it('works with simple HTML', function () {
    var element = compile(function () {
      return _react2.default.createElement(_angularTemplate2.default, { template: '<h1>plop</h1>' });
    });

    (0, _chai.expect)(element.find('h1').html()).to.equal('plop');
  });

  it('works with an interpolation', function () {
    var element = compile(function () {
      return _react2.default.createElement(_angularTemplate2.default, { template: '<h1>{{1+1}}</h1>' });
    });

    (0, _chai.expect)(element.find('h1').html()).to.equal('2');
  });

  it('injects values in the function template', function () {
    var template = function template(_ref) {
      var value = _ref.value;
      return value;
    };
    var element = compile(function () {
      return _react2.default.createElement(_angularTemplate2.default, { template: template, inject: { value: 'plop' } });
    });

    (0, _chai.expect)(element.html()).to.equal('plop');
  });

  it('applies the class to the wrapper', function () {
    var element = compile(function () {
      return _react2.default.createElement(_angularTemplate2.default, { className: 'plop' });
    });

    (0, _chai.expect)(element.hasClass('plop')).to.be.true;
  });

  it('wraps with a div by default', function () {
    var element = compile(function () {
      return _react2.default.createElement(_angularTemplate2.default, null);
    });

    (0, _chai.expect)(element.prop('tagName')).to.equal('DIV');
  });

  it('applies the requested wrapper tag', function () {
    var element = compile(function () {
      return _react2.default.createElement(_angularTemplate2.default, { wrapperTag: 'span' });
    });

    (0, _chai.expect)(element.prop('tagName')).to.equal('SPAN');
  });

  it('applies the requested wrapper directive', function () {
    var element = compile(function () {
      return _react2.default.createElement(_angularTemplate2.default, { wrapperTag: 'simple-template-directive' });
    });

    (0, _chai.expect)(element.prop('tagName')).to.equal('SIMPLE-TEMPLATE-DIRECTIVE');
    (0, _chai.expect)(element.children().hasClass('simple')).to.be.true;
  });

  it('can embed simple directives as JSX with className', function () {
    var element = compile(function () {
      return _react2.default.createElement(
        _angularTemplate2.default,
        { className: 'plop' },
        _react2.default.createElement('plop', { className: 'pof' })
      );
    });

    (0, _chai.expect)(element.prop('tagName')).to.equal('PLOP');
    (0, _chai.expect)(element.hasClass('plop')).to.be.true;
    (0, _chai.expect)(element.hasClass('pof')).to.be.true;
    (0, _chai.expect)(element.children().hasClass('plop')).to.be.true;
  });

  it('can embed component directives as JSX with className', function () {
    var element = compile(function () {
      return _react2.default.createElement(
        _angularTemplate2.default,
        { className: 'plop' },
        _react2.default.createElement('simple-template-directive', { 'class': 'pof', 'ng-bind': '\'pof\'' })
      );
    });

    (0, _chai.expect)(element.prop('tagName')).to.equal('SIMPLE-TEMPLATE-DIRECTIVE');
    (0, _chai.expect)(element.hasClass('plop')).to.be.true;
    (0, _chai.expect)(element.hasClass('pof')).to.be.true;
    // ng-bind removes the actual directive content from the element
    (0, _chai.expect)(element.html()).to.equal('pof');
  });

  it('works with transcluding directives', function () {
    var element = compile(function () {
      return _react2.default.createElement(
        _angularTemplate2.default,
        null,
        _react2.default.createElement(
          'transclude-directive',
          null,
          _react2.default.createElement('plop', null)
        )
      );
    });

    (0, _chai.expect)(element.prop('tagName')).to.equal('TRANSCLUDE-DIRECTIVE');
    (0, _chai.expect)(element.children().hasClass('transclude')).to.be.true;
    (0, _chai.expect)(element.children().children().eq(0).hasClass('one')).to.be.true;
    (0, _chai.expect)(element.children().children().eq(1).hasClass('two')).to.be.true;
    (0, _chai.expect)(element.children().children().eq(1).children().prop('tagName')).to.equal('PLOP');
    (0, _chai.expect)(element.children().children().eq(1).children().children().hasClass('plop')).to.be.true;
  });

  it('does not fail on mutation', function () {
    var element = compile(function () {
      return _react2.default.createElement(
        _angularTemplate2.default,
        null,
        _react2.default.createElement('replace-directive', null)
      );
    });

    (0, _chai.expect)(element.prop('tagName')).to.equal('DIV');
    (0, _chai.expect)(element.hasClass('replace')).to.be.true;
  });

  it('does not fail on repeat', function () {
    var element = compile(function () {
      return _react2.default.createElement(
        _angularTemplate2.default,
        null,
        _react2.default.createElement('div', { 'data-ng-repeat': 'val in [\'a\', \'b\']', 'data-ng-class': 'val' })
      );
    });

    (0, _chai.expect)(element.prop('tagName')).to.equal('DIV');
    (0, _chai.expect)(element.length).to.equal(2);
    (0, _chai.expect)(element.eq(0).hasClass('a')).to.be.true;
    (0, _chai.expect)(element.eq(1).hasClass('b')).to.be.true;
  });

  it('does not fail on ngIf', function () {
    var element = compile(function () {
      return _react2.default.createElement(
        _angularTemplate2.default,
        null,
        _react2.default.createElement('div', { 'data-ng-if': 'false' })
      );
    });

    (0, _chai.expect)(element.length).to.equal(0);
  });

  it('does not crash on props update', function () {
    var Component = function Component(props) {
      return _react2.default.createElement(
        _angularTemplate2.default,
        { className: 'plop' },
        _react2.default.createElement('plop', { 'data-ng-class': 'props.plop' })
      );
    };
    Component.propTypes = {
      plop: _propTypes2.default.string
    };
    var props = {
      plop: 'plop'
    };
    var element = compile(Component, props);

    (0, _chai.expect)(element.prop('tagName')).to.equal('PLOP');
    (0, _chai.expect)(element.hasClass('plop')).to.be.true;
    (0, _chai.expect)(element.hasClass('pof')).to.be.false;

    props.plop = 'pof';
    $rootScope.$apply();

    (0, _chai.expect)(element.hasClass('plop')).to.be.false;
    (0, _chai.expect)(element.hasClass('pof')).to.be.true;
  });

  it('creates a new scope by default', function () {
    var element = compile(function () {
      return _react2.default.createElement(_angularTemplate2.default, null);
    });

    var scope = element.scope();
    (0, _chai.expect)(scope.$parent).to.equal($rootScope);
    (0, _chai.expect)(Object.getPrototypeOf(scope)).to.equal($rootScope);
  });

  it('can prevent a new scope from being created', function () {
    var element = compile(function () {
      return _react2.default.createElement(_angularTemplate2.default, { scope: false });
    });

    (0, _chai.expect)(element.scope()).to.equal($rootScope);
  });

  it('can create an isolate scope', function () {
    var element = compile(function () {
      return _react2.default.createElement(_angularTemplate2.default, { isolate: true });
    });

    var scope = element.scope();
    (0, _chai.expect)(scope.$parent).to.not.equal(Object.getPrototypeOf(scope));
  });

  it('injects scope variables', function () {
    var element = compile(function () {
      return _react2.default.createElement(_angularTemplate2.default, { scope: { plop: 'pof' }, template: '{{plop}}' });
    });

    (0, _chai.expect)(element.html()).to.equal('pof');
  });

  it('can use a template URL', _angular2.default.mock.inject(function ($templateCache) {
    $templateCache.put('plop.html', 'plop');
    var element = compile(function () {
      return _react2.default.createElement(_angularTemplate2.default, { templateUrl: 'plop.html' });
    });

    (0, _chai.expect)(element.html()).to.equal('plop');
  }));

  it('can specify and inject a controller', function () {
    var Controller = function Controller($scope, $document, value) {
      _classCallCheck(this, Controller);

      (0, _chai.expect)($document).to.exist;
      $scope.plop = value;
    };

    var element = compile(function () {
      return _react2.default.createElement(_angularTemplate2.default, {
        controller: Controller,
        template: '{{plop}}',
        inject: { value: 'pof' }
      });
    });

    (0, _chai.expect)(element.html()).to.equal('pof');
  });

  it('can specify and inject a controller with controllerAs', function () {
    var Controller = function Controller($scope, $document, value) {
      _classCallCheck(this, Controller);

      (0, _chai.expect)($document).to.exist;
      this.plop = value;
    };

    var element = compile(function () {
      return _react2.default.createElement(_angularTemplate2.default, {
        controller: Controller,
        controllerAs: 'ctl',
        template: '{{ctl.plop}}',
        inject: { value: 'pof' }
      });
    });

    (0, _chai.expect)(element.html()).to.equal('pof');
  });

  it('applies attributes to the surrounding tag', function () {
    var element = compile(function () {
      return _react2.default.createElement(_angularTemplate2.default, {
        wrapperAttrs: {
          id: 'plop',
          'data-ng-bind': '"pof"',
          'aria-role': 'menu'
        }
      });
    });

    (0, _chai.expect)(element.html()).to.equal('pof');
    (0, _chai.expect)(element.attr('id')).to.equal('plop');
    (0, _chai.expect)(element.attr('aria-role')).to.equal('menu');
  });

  it('exposes the scope in the API', function () {
    var found = {};

    var Component = function (_React$Component) {
      _inherits(Component, _React$Component);

      function Component() {
        _classCallCheck(this, Component);

        return _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).apply(this, arguments));
      }

      _createClass(Component, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          found.$scope = this.ra.$scope;
          found.$element = this.ra.$element;
        }
      }, {
        key: 'render',
        value: function render() {
          var _this2 = this;

          return _react2.default.createElement(_angularTemplate2.default, { ref: function ref(ra) {
              return _this2.ra = ra;
            } });
        }
      }]);

      return Component;
    }(_react2.default.Component);

    compile(Component);

    (0, _chai.expect)(found.$scope).to.exist;
    (0, _chai.expect)(found.$scope.$parent).to.equal($rootScope);
    (0, _chai.expect)(found.$element).to.exist;
    (0, _chai.expect)(found.$element.prop('tagName')).to.equal('DIV');
  });

  it('passes the scope in ngReact custom directives', function () {
    var found = {};
    var Component = function Component() {
      return _react2.default.createElement(_angularTemplate2.default, { ref: function ref(ra) {
          return found.ra = ra;
        } });
    };

    $rootScope.propsToPass = { toto: 'voila' };
    $rootScope.Component = Component;

    var $element = $compile('<ng-react-directive toto="propsToPass.toto" component="Component" />')($rootScope, function (clone) {
      $container.append(clone);
    });
    $rootScope.$digest();

    (0, _chai.expect)(found.ra.$scope).to.exist;
    (0, _chai.expect)(found.ra.$scope.$parent).to.equal($rootScope);
    (0, _chai.expect)($element.find('span').length).to.equal(1);
    (0, _chai.expect)($element.find('span').attr('class')).to.equal('toto');
    (0, _chai.expect)($element.find('span').text()).to.equal('voila');
  });

  it('passes the scope in the context', function () {
    var found = {};

    var Component = function (_React$Component2) {
      _inherits(Component, _React$Component2);

      function Component() {
        _classCallCheck(this, Component);

        return _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).apply(this, arguments));
      }

      _createClass(Component, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          found.$scope = this.ra.$scope;
        }
      }, {
        key: 'render',
        value: function render() {
          var _this4 = this;

          return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(_angularTemplate2.default, { ref: function ref(ra) {
                return _this4.ra = ra;
              } }),
            _react2.default.createElement(
              'span',
              { className: 'toto' },
              this.props.toto
            )
          );
        }
      }]);

      return Component;
    }(_react2.default.Component);

    Component.propTypes = {
      toto: _propTypes2.default.string.isRequired
    };

    var ComponentPassingScope = (0, _angularTemplate.provideAngularScopeHOC)(Component);

    _angular2.default.module('testAngularTemplate').Component = ComponentPassingScope;
    $rootScope.propsToPass = { toto: 'voila' };

    var $element = $compile('<manual-react props="propsToPass"></manual-react>')($rootScope, function (clone) {
      $container.append(clone);
    });
    $rootScope.$digest();

    (0, _chai.expect)(found.$scope).to.exist;
    (0, _chai.expect)(found.$scope.props).to.exist;
    (0, _chai.expect)(found.$scope.props()).to.eql({ toto: 'voila' });
    (0, _chai.expect)($element.find('span').length).to.equal(1);
    (0, _chai.expect)($element.find('span').attr('class')).to.equal('toto');
    (0, _chai.expect)($element.find('span').text()).to.equal('voila');
  });
});
//# sourceMappingURL=angularTemplate.test.js.map