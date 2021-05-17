import React from "react"
import { render, fireEvent, waitFor } from "../../../test-utils"
import HotelList from ".."
import { 
  collatedData, 
  fewCompetitorsCollatedData,
  collatedDataWithTax,
  collatedDataWithoutPrice
} from '../__data_mocks__'

describe("Hotel Card Component", () => {
  it("Should be able to display general hotel data", () => {
    const { getByText, queryByText, queryByTestId } = render(<HotelList data={collatedData} />);
    
    const hotelName = getByText(/Shinagawa Prince Hotel/i);
    const hotelRating = getByText(/7.7/i);
    const hotelAddress = getByText(/108-8611 Tokyo Prefecture, Minato-ku, Takanawa 4-10-30, Japan/i);
    const hotelPrice = getByText(/120/i);
    const hotelDesc = queryByText(/Boasting 15 food and beverage options/i);
    const taxInfo = queryByTestId('taxInfo');
    
    expect(hotelName).toBeInTheDocument();
    expect(hotelRating).toBeInTheDocument();
    expect(hotelAddress).toBeInTheDocument();
    expect(hotelPrice).toBeInTheDocument();
    expect(hotelDesc).not.toBeInTheDocument();
    expect(taxInfo).not.toBeInTheDocument();
  });

  it("Should show hotel description by clicking hotel card", async () => {
    const { getByTestId, queryByText } = render(<HotelList data={collatedData} />);

    const hotelContainer = getByTestId('hotelContainer');
    fireEvent.click(hotelContainer);

    await waitFor(() => {
      expect(queryByText(/Boasting 15 food and beverage options/i)).toBeInTheDocument()
    })
  });

  it("Should show dropdown if it has over 3 competitors", async () => {
    const { queryAllByTestId, queryByText } = render(<HotelList data={collatedData} />);

    const dropdownComp = queryByText(/Compare 6 prices/i);
    expect(dropdownComp).toBeInTheDocument();

    fireEvent.click(dropdownComp);
    await waitFor(() => {
      expect(queryAllByTestId('priceItemList')).toHaveLength(6);
      expect(queryByText(/Booking.com/i)).toBeInTheDocument();
      expect(queryByText(/125/i)).toBeInTheDocument();
    })

    const saveRatesEl = queryAllByTestId('saveRates');
    expect(saveRatesEl).toHaveLength(3);
  });

  it("Should not show dropdown if it has few competitors", () => {
    const { queryByText } = render(<HotelList data={fewCompetitorsCollatedData} />);
    const dropdownComp = queryByText(/Compare 6 prices/i);
    expect(dropdownComp).not.toBeInTheDocument();
  });

  it("Should show tax-inclusive info if given", async () => {
    const { queryByTestId, getByText, getByTestId } = render(<HotelList data={collatedDataWithTax} />);

    const taxInfo = queryByTestId('taxInfo');
    expect(taxInfo).toBeInTheDocument();

    fireEvent.mouseOver(taxInfo);

    await waitFor(() => {
      expect(getByTestId('taxInfoDetail')).toBeInTheDocument();
      expect(getByText(/This price is tax-inclusive/i)).toBeInTheDocument();
    })
  });

  it("Should show Rates Unavailable if no price given", async () => {
    const { getByText } = render(<HotelList data={collatedDataWithoutPrice} />);

    const ratesUnavailable = getByText('Rates Unavailable');
    expect(ratesUnavailable).toBeInTheDocument();
  });
});
