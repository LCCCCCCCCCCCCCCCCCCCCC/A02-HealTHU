from django.test import TestCase

# Create your tests here.
import unittest
from schedule.views import nDays

class TestNDays(unittest.TestCase):
    def setUp(self):
        self.date = "2020/12/31"

    def test_nDays_one_day(self):
        expected = ["2020/12/31"]
        result = nDays(self.date, 1)
        self.assertEqual(result, expected)

    def test_nDays_three_days(self):
        expected = ["2020/12/31", "2021/01/01", "2021/01/02"]
        result = nDays(self.date, 3)
        self.assertEqual(result, expected)

    def test_nDays_zero_day(self):
        expected = []
        result = nDays(self.date, 0)
        self.assertEqual(result, expected)

if __name__ == '__main__':
    unittest.main()