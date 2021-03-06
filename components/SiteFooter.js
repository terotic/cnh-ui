import React from 'react';
import PropTypes from 'prop-types';
import {
  Container, Row, Col, Nav, NavItem, NavLink,
} from 'reactstrap';

import styled, { withTheme } from 'styled-components';
import ApplicationStateBanner from './common/ApplicationStateBanner';
import PlanContext from '../context/plan';

const Logo = styled.div`
  height: 4em;
  margin-bottom: 4rem;
`;

const StyledFooter = styled.footer`
  position: relative;
  min-height: 14em;
  clear: both;
  background-color: ${props => props.theme.brandDark};
  color: #ffffff;
  padding: 6rem 0;
  
    &::before {
      content: " ";
      @include koro("storm", $hel-tram, 600);
      width: 100%;
      height: $spacer * 3;
      position: absolute;
      top: $spacer * -3;
    }
  
  .footer-column {
    text-align: center;
  }
  
  a {
    color: $white;
  }
`;


function SiteFooter(props) {
  const plan = React.useContext(PlanContext);
  const generalContent = plan.generalContent || {};
  const { siteTitle, instanceType } = props;

  return (
    <>
      <ApplicationStateBanner instanceType={instanceType} />
      <StyledFooter className="site-footer">
        <Container fluid>
          <Row>
            <Col md="4" className="footer-column">
              <h5>{siteTitle}</h5>
            </Col>
            <Col md="4" className="footer-column">
              <div className="footer-branding footer-branding-helsinki">
                <a href="http://www.hel.fi">
                  <Logo aria-hidden="true" className="footer-org-logo" />
                </a>
              </div>
            </Col>
            <Col md="4" className="footer-column">
              <div className="page-footer-block">
                <Nav vertical>
                  <NavItem>
                    <NavLink className="nav-link active" href="/">Etusivu</NavLink>
                  </NavItem>
                </Nav>
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="footer-column">
              <div className="site-footer-small-print">
                { generalContent.creativeCommonsLicense && (
                  <Nav vertical>
                    <NavItem>{ generalContent.creativeCommonsLicense }</NavItem>
                  </Nav>
                )}
                { generalContent.copyrightText && (
                  <Nav vertical>
                    <NavItem className="list-inline-item">{ generalContent.copyrightText }</NavItem>
                  </Nav>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </StyledFooter>
    </>
  );
}

SiteFooter.propTypes = {
  siteTitle: PropTypes.string.isRequired,
  instanceType: PropTypes.string.isRequired,
};

export default withTheme(SiteFooter);
