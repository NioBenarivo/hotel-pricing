import React from "react"
import { render, fireEvent, waitForElementToBeRemoved, screen } from "../../test-utils"
import HotelList from ".."
import { hotelListMock, priceListMock } from '../__data_mocks__'

describe("Hotel List Page", () => {
  it("Should be able to fetch and display hotel list", async () => {
    global.fetch = jest.fn((url) => {
      const isHotelAPI = url.indexOf('USD') > -1 ? false : true
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve(isHotelAPI ? hotelListMock : priceListMock),
      })
    })

    const { getByText, getByTestId } = render(<HotelList />);
    const inputSearchEl = getByTestId('inputSearch');
    fireEvent.change(inputSearchEl, { target: { value: 'tokyo' } })

    const submitBtn = getByText('Search');
    fireEvent.click(submitBtn);

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/i))
    
    const hotelName = await getByText(/Shinagawa Prince Hotel/i);
    expect(hotelName).toBeInTheDocument();
  });

  it("Should display error message when response is failed", async () => {
    global.fetch = jest.fn((url) => {
      return Promise.resolve({
        status: 500,
        json: () => Promise.resolve({ data: 'Not Found' }),
      })
    })

    const { getByText, getByTestId } = render(<HotelList />);
    const inputSearchEl = getByTestId('inputSearch');
    fireEvent.change(inputSearchEl, { target: { value: 'osaka' } })

    const submitBtn = getByText('Search');
    fireEvent.click(submitBtn);

    await waitForElementToBeRemoved(() => screen.getByText(/Loading/i))
    
    const errMsg = await getByText(/Search Not Found. Please try again./i);
    expect(errMsg).toBeInTheDocument();
  })
});


