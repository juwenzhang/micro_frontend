import { registerApplication, startApp } from '../src/index';
import { apps } from '../src/utils/app';

describe('single-spa 核心功能测试', () => {
  let mockApp;

  beforeEach(() => {
    mockApp = {
      mount: cy.stub().as('mockMount'),
      unmount: cy.stub().as('mockUnmount')
    };
  });

  it('应该正确注册应用', () => {
    registerApplication('testApp', () => Promise.resolve(mockApp), () => true);
    // 断言应用已注册
    cy.window().then((win) => {
      // 这里需要根据实际实现调整断言逻辑
      expect(Object.keys(apps)).to.include('bootstrap')
      expect(Object.keys(apps)).to.include('mount')
      expect(Object.keys(apps)).to.include('unmount')
    });
  });

  it('应该正确挂载和卸载应用', () => {
    registerApplication('testApp', () => Promise.resolve(mockApp), () => true);
    startApp();

    cy.get('@mockMount').should('have.been.called');

    // 模拟路由变化，使应用不满足激活条件
    // 这里需要根据实际实现调整路由变化逻辑
    cy.window().then((win) => {
      win.location.hash = '#/other'; 
    });

    cy.get('@mockUnmount').should('have.been.called');
  });
});