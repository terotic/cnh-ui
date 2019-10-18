import React from 'react';
import PropTypes from 'prop-types';

import {
  Jumbotron as BaseJumbotron, Container, Row, Col, Alert, Table,
} from 'reactstrap';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { Link } from '../../routes';
import PlanContext from '../../context/plan';

import { withTranslation } from '../../common/i18n';
import ContentLoader from '../common/ContentLoader';
import ErrorMessage from '../common/ErrorMessage';
import ErrorBoundary from '../common/ErrorBoundary';
import { ActionLink } from '../../common/links';
import { Meta } from '../layout';

import IndicatorGraph from '../graphs/IndicatorGraph';
import IndicatorValueSummary from './IndicatorValueSummary';
import IndicatorCard from './IndicatorCard';
import ActionImpact from '../actions/ActionImpact';
import ActionStatus from '../actions/ActionStatus';


const GET_INDICATOR_DETAILS = gql`
  query IndicatorDetails($id: ID, $plan: ID, $identifier: ID) {
    indicator(plan: $plan, id: $id, identifier: $identifier) {
      id
      identifier
      name
      level(plan: $plan)
      description
      timeResolution
      unit {
        id
        name
        shortName
        verboseName
        verboseNamePlural
      }
      latestGraph {
        id
      }
      values {
        id
        date
        value
      }
      goals(plan: $plan) {
        id
        date
        value
      }
      actions(plan: $plan) {
        id
        identifier
        name
        status {
          id
          identifier
          name
        }
        completion
        impact {
          id
          identifier
          name
        }
      }
      relatedCauses {
        id
        effectType
        confidenceLevel
        causalIndicator {
          id
          name
          level(plan: $plan)
        }
      }
      relatedEffects {
        id
        effectType
        confidenceLevel
        effectIndicator {
          id
          name
          level(plan: $plan)
        }
      }
    }
  }
`;

const IndicatorHero = styled(BaseJumbotron)`
  margin-bottom: 2rem;

  a {
    color: inherit;
  }
`;

const IndicatorLevel = styled.h6 `
  display: inline-block;
  border-radius: .75em;
  padding: .25em 1em;
  margin-bottom: 1em;
  color: ${(props) => {
    switch (props.level) {
      case 'action':
        return '#ffffff';
      case 'operational':
        return '#000000';
      case 'tactical':
        return '#000000';
      case 'strategic':
        return '#ffffff';
      default:
        return '#000000';
    }
  }};
  background-color: ${(props) => {
    switch (props.level) {
      case 'action':
        return props.theme.actionColor;
      case 'operational':
        return props.theme.operationalIndicatorColor;
      case 'tactical':
        return props.theme.tacticalIndicatorColor;
      case 'strategic':
        return props.theme.strategicIndicatorColor;
      default:
        return '#cccccc';
    }
  }};
`;

const Section = styled.section`
  padding: 3em 0 6em;
  margin-bottom: -3em;

  h2 {
    margin-bottom: 1em;
  }
`;

const CausalNavigation = styled.div`
  padding-top: 2rem;
  background-color: ${(props) => props.theme.themeColors.light};
`;

function getLevelName(level, t) {
  return t(level);
}

function IndicatorDetails(props) {
  const { t, indicator, plan } = props;

  return (
    <div className="mb-5">
      <Meta
        title={t('indicators')}
        description={`${indicator.name}`}
        />
      <IndicatorHero level={indicator.level}>
        <Container>
          <IndicatorLevel level={indicator.level}>
            <Link href="/indicators">
              <a>
                { getLevelName(indicator.level, t) }
              </a>
            </Link>
          </IndicatorLevel>
          <h1>{indicator.name}</h1>
          { (indicator.goals.length > 0  || indicator.goals.length > 0) &&
          (
            <IndicatorValueSummary
              timeResolution={indicator.timeResolution}
              values={indicator.values}
              unit={indicator.unit}
              goals={indicator.goals}
            />
          )}
        </Container>
      </IndicatorHero>
      <Container>
        <Row>
          <Col md="10" className="mb-5">
            <div className="mt-4" dangerouslySetInnerHTML={{ __html: indicator.description }} />
          </Col>
        </Row>
        <Row>
          <Col className="mb-5">
            <h2>{ t('graph') }</h2>
            {(indicator.latestGraph || indicator.values.length)
              ? <ErrorBoundary><IndicatorGraph indicator={indicator} plan={plan} /></ErrorBoundary>
              : <Alert><h5>{ t('no-graph') }</h5></Alert>}
          </Col>
        </Row>
      </Container>
      { indicator.actions.length > 0 && (
        <Section>
          <Container>
            <Row>
              <Col className="mb-4">
                <h3>{t('indicator-related-actions')}</h3>
              </Col>
            </Row>
            <Row>
              <Col>
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th colSpan="2" scope="col">{ t('action') }</th>
                      <th scope="col">{ t('action-progress') }</th>
                      <th scope="col">{ t('action-impact') }</th>
                    </tr>
                  </thead>
                  <tbody>
                    { indicator.actions.map((action) => (
                      <ActionLink id={action.identifier} key={action.id}>
                        <tr>
                          <td><strong>{ action.identifier }</strong></td>
                          <td>{ action.name }</td>
                          <td width="200">
                            <ActionStatus
                              identifier={action.status.identifier}
                              name={action.status.name}
                              completion={action.status.completion}
                            />
                          </td>
                          <td>
                            <ActionImpact
                              identifier={action.impact.identifier}
                              name={action.impact.name}
                            />
                          </td>
                        </tr>
                      </ActionLink>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
        </Section>
      )}
      <CausalNavigation>
        <Container>
          <Row>
            <Col sm="6" lg={{ size: 5 }} className="mb-5">
              <h4 className="mb-4">{ t('indicator-affected-by') }</h4>
              { indicator.relatedCauses
                ? indicator.relatedCauses.map((cause) => (
                  <IndicatorCard
                    objectid={cause.causalIndicator.id}
                    name={cause.causalIndicator.name}
                    level={cause.causalIndicator.level}
                    key={cause.causalIndicator.id}
                  />
                )) : <div />}
            </Col>

            <Col sm="6" lg={{ size: 5, offset: 2 }} className="mb-5">
              <h4 className="mb-4">{ t('indicator-has-effect-on') }</h4>
              { indicator.relatedEffects.length
                ? indicator.relatedEffects.map((effect) => (
                  <IndicatorCard
                    objectid={effect.effectIndicator.id}
                    name={effect.effectIndicator.name}
                    level={effect.effectIndicator.level}
                    key={effect.effectIndicator.id}
                  />
                )) : <div />}
            </Col>
          </Row>
        </Container>
      </CausalNavigation>
    </div>
  );
}

IndicatorDetails.propTypes = {
  indicator: PropTypes.shape({
    name: PropTypes.string.isRequired,
    goals: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.number.isRequired,
    })),
  }).isRequired,
};


class IndicatorContent extends React.Component {
  static contextType = PlanContext;

  render() {
    const { t, id } = this.props;
    const plan = this.context;

    return (
      <Query query={GET_INDICATOR_DETAILS} variables={{ id, plan: plan.identifier }}>
        {({ loading, error, data }) => {
          if (loading) return <ContentLoader />;
          if (error) return <ErrorMessage message={error.message} />;
          const { indicator } = data;
          if (!indicator) {
            return <ErrorMessage statusCode={404} message={ t('indicator-not-found') } />
          }
          return <IndicatorDetails indicator={indicator} plan={plan} t={t}/>;
        }}
      </Query>
    );
  }
}

IndicatorContent.propTypes = {
  id: PropTypes.string.isRequired,
};

IndicatorDetails.propTypes = {
  plan: PropTypes.shape({}).isRequired,
  indicator: PropTypes.shape({
    actions: PropTypes.array.isRequired,
    relatedCauses: PropTypes.array.isRequired,
    relatedEffects: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    timeResolution: PropTypes.string.isRequired,
  }).isRequired,
}

export default withTranslation('common')(IndicatorContent);
