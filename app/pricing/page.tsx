'use client';

import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';

import { CheckCircleIcon } from '@/components/icons/check-circle';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const plans = [
  {
    name: 'Billed annually',
    price: '$150',
    isRecommended: true,
  },
  {
    name: 'Billed monthly',
    price: '$200',
    isRecommended: false,
  },
];

const features = [
  {
    id: 1,
    name: '24/7 technical support',
  },
  {
    id: 2,
    name: 'Performance optimization consulting',
  },
  {
    id: 3,
    name: 'Custom feature development',
  },
  {
    id: 4,
    name: 'Advanced analytics',
  },
];

export default function Pro() {
  const [selected, setSelected] = useState(plans[0]);
  return (
    <>
      <div className="container text-white grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="p-6">
          <h3 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
            Unlock all features
          </h3>
          <p className="mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
            Get the full potential of your data with our enhanced features that
            enable advanced data analytics and informed decision-making.
          </p>
          <div className="mt-8 space-y-6">
            <div className="relative border-l-2 border-tremor-border pl-4 dark:border-dark-tremor-border">
              <h4 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                <a href="#" className="focus:outline-none">
                  {/* Extend link to entire card */}
                  <span className="absolute inset-0" aria-hidden={true} />
                  Batching &#8594;
                </a>
              </h4>
              <p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Bulk task operations and batch processing optimizations
              </p>
            </div>
            <div className="relative border-l-2 border-tremor-border pl-4 dark:border-dark-tremor-border">
              <h4 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                <a href="#" className="focus:outline-none">
                  {/* Extend link to entire card */}
                  <span className="absolute inset-0" aria-hidden={true} />
                  Unique Tasks &#8594;
                </a>
              </h4>
              <p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Deduplicate tasks to only allow running once
              </p>
            </div>
            <div className="relative border-l-2 border-tremor-border pl-4 dark:border-dark-tremor-border">
              <h4 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                <a href="#" className="focus:outline-none">
                  {/* Extend link to entire card */}
                  <span className="absolute inset-0" aria-hidden={true} />
                  Apalis Pro Dashboard &#8594;
                </a>
              </h4>
              <p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Real-time dashboard with detailed task execution statistics
              </p>
            </div>
            <div className="relative border-l-2 border-tremor-border pl-4 dark:border-dark-tremor-border">
              <h4 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                <a href="#" className="focus:outline-none">
                  {/* Extend link to entire card */}
                  <span className="absolute inset-0" aria-hidden={true} />
                  Task Execution History &#8594;
                </a>
              </h4>
              <p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Detailed logs of task runs, durations, and outcomes
              </p>
            </div>
             <div className="relative border-l-2 border-tremor-border pl-4 dark:border-dark-tremor-border">
              <h4 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                <a href="#" className="focus:outline-none">
                  {/* Extend link to entire card */}
                  <span className="absolute inset-0" aria-hidden={true} />
                  SLA Monitoring &#8594;
                </a>
              </h4>
              <p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Service level agreement tracking with breach notifications
              </p>
            </div>
            <div className="relative border-l-2 border-tremor-border pl-4 dark:border-dark-tremor-border">
              <h4 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                <a href="#" className="focus:outline-none">
                  {/* Extend link to entire card */}
                  <span className="absolute inset-0" aria-hidden={true} />
                  Dead Letter Queues &#8594;
                </a>
              </h4>
              <p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Automatic routing of failed tasks to separate queues for analysis
              </p>
            </div>
             <div className="relative border-l-2 border-tremor-border pl-4 dark:border-dark-tremor-border">
              <h4 className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                <a href="#" className="focus:outline-none">
                  {/* Extend link to entire card */}
                  <span className="absolute inset-0" aria-hidden={true} />
                  Advanced Rate Limiting &#8594;
                </a>
              </h4>
              <p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Apply advanced rate limiting strategies
              </p>
            </div>
          </div>
        </div>
        <form method="POST" action="#">
          <div className="items-center rounded-none-tremor-default border border-tremor-border bg-tremor-background-muted p-6 dark:border-dark-tremor-border dark:bg-dark-tremor-background h-full">
            <h3 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Professional Plan Subscription
            </h3>
            <RadioGroup
              value={selected}
              onChange={setSelected}
              name="plan"
              className="mt-4"
            >
              <RadioGroup.Label className="sr-only">
                Plan details
              </RadioGroup.Label>
              <div className="space-y-4">
                {plans.map((plan) => (
                  <RadioGroup.Option
                    key={plan.name}
                    value={plan}
                    className={({ active }) =>
                      classNames(
                        active
                          ? 'border-tremor-brand-subtle ring-2 ring-tremor-brand-muted active:border-tremor-brand-subtle dark:border-dark-tremor-brand-subtle dark:ring-dark-tremor-brand-muted focus:dark:border-dark-tremor-brand-subtle'
                          : 'border-tremor-border dark:border-dark-tremor-border',
                        'relative block cursor-pointer rounded-none-tremor-default border bg-tremor-background transition dark:bg-dark-tremor-background',
                      )
                    }
                  >
                    {({ active, checked }) => (
                      <>
                        <div className="flex items-center justify-between space-x-6 px-4 py-4 sm:px-6">
                          <div className="flex items-center space-x-3 truncate">
                            <span
                              className={classNames(
                                checked
                                  ? 'border-transparent bg-tremor-brand'
                                  : 'border-tremor-border bg-tremor-background dark:border-dark-tremor-border dark:bg-dark-tremor-background',
                                'flex size-4 shrink-0 items-center justify-center rounded-sm border',
                              )}
                              aria-hidden={true}
                            >
                              <span className="size-1.5 rounded-sm bg-tremor-background dark:bg-dark-tremor-background" />
                            </span>
                            <div className="block items-center space-x-3 truncate lg:flex">
                              <RadioGroup.Label
                                as="span"
                                className="truncate text-tremor-default font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong"
                              >
                                {plan.name}
                              </RadioGroup.Label>
                              {plan.isRecommended ? (
                                <span className="hidden items-center rounded-none-tremor-small bg-tremor-brand-faint px-2 py-1 text-tremor-label font-medium text-tremor-brand ring-1 ring-inset ring-tremor-brand-muted dark:bg-dark-tremor-brand-faint dark:text-dark-tremor-brand dark:ring-dark-tremor-brand-muted lg:inline-flex">
                                  Save 25%
                                </span>
                              ) : null}
                            </div>
                          </div>
                          <RadioGroup.Description
                            as="p"
                            className="flex items-baseline"
                          >
                            <span className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong sm:text-tremor-title">
                              {plan.price}
                            </span>
                            <span className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                              /mo
                            </span>
                          </RadioGroup.Description>
                        </div>
                        <span
                          className={classNames(
                            active ? 'border' : 'border-2',
                            checked
                              ? 'border-tremor-brand dark:border-dark-tremor-brand'
                              : 'border-transparent',
                            'pointer-events-none absolute -inset-px rounded-none-tremor-default',
                          )}
                          aria-hidden={true}
                        />
                      </>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
            <ul className="mt-4 divide-y-0 text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis">
              {features.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-start space-x-2 py-2.5"
                >
                  <CheckCircleIcon
                    className="size-5 shrink-0 text-tremor-brand dark:text-dark-tremor-brand"
                    aria-hidden={true}
                  />
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
            {/* <Divider /> */}
            <button
              type="submit"
              className="w-full whitespace-nowrap rounded-none-tremor-small bg-tremor-brand py-2.5 text-center text-tremor-default font-medium text-tremor-brand-inverted shadow-tremor-input hover:bg-tremor-brand-emphasis dark:bg-dark-tremor-brand dark:text-dark-tremor-brand-inverted dark:shadow-dark-tremor-input dark:hover:bg-dark-tremor-brand-emphasis"
            >
              Buy and upgrade
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
